const express = require('express');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
    
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json(await sequelize.query(`
      SELECT
        Id AS id,
        Name AS name,
        CategoryId AS categoryId,
        Description AS description,
        Price AS price,
        Weight AS weight,
        IsCustom AS isCustom,
        ImageUrl AS imageUrl,
        CreatedAt AS createdAt
      FROM Products
      `, {
      logging: false,
      type: QueryTypes.SELECT
    }))
  } catch (error) {
    console.error(error)
  } finally {
    res.end()
  }
})

router.get('/:id(\\d+)', async (req, res) => {
  try {
    res.json(await sequelize.query(`
      SELECT
        Id AS id,
        Name AS name,
        CategoryId AS categoryId,
        Description AS description,
        Price AS price,
        Weight AS weight,
        IsCustom AS isCustom,
        ImageUrl AS imageUrl,
        CreatedAt AS createdAt
      FROM Products
      WHERE Id = :id
      `, {
        logging: false,
        type: QueryTypes.SELECT,
        replacements: {
          id: req.params.id
        }
      }))
    } catch (error) {
      console.error(error)
    } finally {
      res.end()
    }
})

module.exports = router