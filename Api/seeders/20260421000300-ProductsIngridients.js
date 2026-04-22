'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('ProductsIngridients', [
      { ProductId: 1, IngridientId: 1, Quantity: 0.35 },
      { ProductId: 1, IngridientId: 2, Quantity: 0.2 },
      { ProductId: 1, IngridientId: 3, Quantity: 0.25 },
      { ProductId: 2, IngridientId: 2, Quantity: 0.07 },
      { ProductId: 3, IngridientId: 1, Quantity: 0.09 },
      { ProductId: 3, IngridientId: 2, Quantity: 0.04 },
      { ProductId: 4, IngridientId: 1, Quantity: 0.9 },
      { ProductId: 4, IngridientId: 3, Quantity: 0.6 },
      { ProductId: 5, IngridientId: 5, Quantity: 0.01 },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ProductsIngridients', null, {});
  },
};
