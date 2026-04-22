const express = require('express');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const router = express.Router();

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')

    if (token[0].toLowerCase() != 'bearer')
      return res.status(400).send('не поддерживаемый тип авторизации')

    jwt.verify(token[1], JWT_SECRET, (err, data) => {
      if (err) return res.status(403).send(err)

      req.user = data
      next()
    })
  } else {
    res.status(401).send('нет заголовка авторизации')
  }
}

router.post('/', [authenticateJWT], async function(req, res) {
  const quantity = Number(req.body.quantity || 1)
  if (!req.body.productId || Number.isNaN(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Некорректные productId/quantity' })
  }

  try {
    await sequelize.query(`
      INSERT INTO Cart (ProductId, Quantity, userId)
      VALUES (:productId, :quantity, :userId)
    `,{
      logging: false,
      type: QueryTypes.INSERT,
      replacements: {
        productId: req.body.productId,
        quantity,
        userId: req.user.id
      }
    })
    res.status(201)
  } catch (error) {
    console.warn('ошибка при добавлении блюда в корзину:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
})

router.get('/', [authenticateJWT], async (req, res) => {
  try {
    res.json(await sequelize.query(`
      SELECT
        c.Id AS id,
        c.ProductId AS productId,
        c.Quantity AS quantity,
        c.userId,
        p.Name AS name,
        p.Price AS price
      FROM Cart c
      INNER JOIN Products p ON p.Id = c.ProductId
      WHERE c.userId=:userId
    `, {
      logging: false,
      type: QueryTypes.SELECT,
      replacements: {
        userId: req.user.id
      }
    }))
  } catch (error) {
    console.error(error)
  } finally {
    res.end()
  }
})

router.patch('/:id(\\d+)', [authenticateJWT], async (req, res) => {
  try {
    await sequelize.query(`
      UPDATE Cart 
      SET Quantity=:quantity
      WHERE Id=:id AND userId=:userId
    `,{
      logging: false,
      replacements: {
        id: req.params.id,
        quantity: req.body.quantity,
        userId: req.user.id
      }
    })
  } catch (error) {
    console.warn('ошибка при редактировании корзины:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
})

router.delete('/:id(\\d+)', [authenticateJWT], async (req, res) => {
  try {
    await sequelize.query(`
      DELETE 
      FROM Cart
      WHERE Id=:id AND userId=:userId
    `,{
      logging: false,
      replacements: {
        id: req.params.id,
        userId: req.user.id
      }
    })
    res.status(204)
  } catch (error) {
    console.warn('ошибка при удалении блюда из корзины:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
}) 

module.exports = router;