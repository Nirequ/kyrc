const express = require('express');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const md5 = require('md5');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'

const router = express.Router();

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).send('нет заголовка авторизации')

  const token = authHeader.split(' ')
  if (token[0].toLowerCase() !== 'bearer') {
    return res.status(400).send('не поддерживаемый тип авторизации')
  }

  jwt.verify(token[1], JWT_SECRET, (err, data) => {
    if (err) return res.status(403).send(err)
    req.user = data
    next()
  })
}

router.post('/register', async (req, res) => {
  const { login, password, firstName } = req.body || {}

  if (!login || !password) {
    return res.status(400).json({ message: 'login и password обязательны' })
  }
  if (String(login).trim().length < 3) {
    return res.status(400).json({ message: 'login должен быть не короче 3 символов' })
  }
  if (String(password).length < 5) {
    return res.status(400).json({ message: 'password должен быть не короче 5 символов' })
  }

  try {
    const existingUser = await sequelize.query(
      `
      SELECT id
      FROM User
      WHERE login = :login
    `,
      {
        plain: true,
        logging: false,
        type: QueryTypes.SELECT,
        replacements: { login },
      },
    )

    if (existingUser) {
      return res.status(409).json({ message: 'пользователь уже существует' })
    }

    const hashedPassword = md5(password)
    const [result] = await sequelize.query(
      `
      INSERT INTO User (login, password, firstName, createdAt, updatedAt)
      VALUES (:login, :password, :firstName, NOW(), NOW())
    `,
      {
        logging: false,
        type: QueryTypes.INSERT,
        replacements: {
          login,
          password: hashedPassword,
          firstName: firstName || login,
        },
      },
    )

    const jwtToken = jwt.sign(
      {
        id: result,
        firstName: firstName || login,
      },
      JWT_SECRET,
    )

    res.status(201).json({
      token: jwtToken,
      user: {
        id: result,
        login,
        firstName: firstName || login,
      },
    })
  } catch (error) {
    console.warn('ошибка при регистрации:', error.message)
    res.status(500).json({ message: error.message })
  }
})

router.post('/login', async (req, res) => {
  const { login, password } = req.body || {}
  if (!login || !password) {
    return res.status(400).json({ message: 'login и password обязательны' })
  }

  try {
    const user = await sequelize.query(`
      SELECT
        id,
        login,
        password,
        firstName,
        geoLat,
        geoLng,
        geoAddress
      FROM User
      WHERE login=:login
    `, {
      plain: true,
      logging: false,
      type: QueryTypes.SELECT,
      replacements: {
        login
      }
    })

    if (user) {
      const passwordMD5 = md5(password)
      if (user.password == passwordMD5) {
        const jwtToken = jwt.sign({
            id: user.id, 
            firstName: user.firstName
          }, 
          JWT_SECRET
        )

        res.json({
          token: jwtToken,
          user: {
            id: user.id,
            login: user.login,
            firstName: user.firstName,
            geolocation: {
              lat: user.geoLat ? Number(user.geoLat) : null,
              lng: user.geoLng ? Number(user.geoLng) : null,
              address: user.geoAddress || '',
            },
          },
        })
      } else {
        res.status(401).send('не верный пароль')
      }
    } else {
      res.status(404).send('пользователь не найден')
    }
  } catch (error) {
    console.warn('ошибка при авторизации:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
})

router.patch('/geolocation', [authenticateJWT], async (req, res) => {
  const { lat, lng, address } = req.body || {}
  const normalizedLat = lat === null || lat === '' ? null : Number(lat)
  const normalizedLng = lng === null || lng === '' ? null : Number(lng)
  const normalizedAddress = address ? String(address).trim() : null

  if ((normalizedLat !== null && Number.isNaN(normalizedLat)) || (normalizedLng !== null && Number.isNaN(normalizedLng))) {
    return res.status(400).json({ message: 'lat/lng должны быть числами или null' })
  }

  try {
    await sequelize.query(
      `
      UPDATE User
      SET
        geoLat = :geoLat,
        geoLng = :geoLng,
        geoAddress = :geoAddress,
        updatedAt = NOW()
      WHERE id = :userId
    `,
      {
        logging: false,
        replacements: {
          userId: req.user.id,
          geoLat: normalizedLat,
          geoLng: normalizedLng,
          geoAddress: normalizedAddress,
        },
      },
    )

    res.json({
      geolocation: {
        lat: normalizedLat,
        lng: normalizedLng,
        address: normalizedAddress || '',
      },
    })
  } catch (error) {
    console.warn('ошибка при сохранении геолокации:', error.message)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router;