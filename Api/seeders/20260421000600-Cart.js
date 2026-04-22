'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Cart', [
      { Id: 1, ProductId: 1, Quantity: 1, userId: 1 },
      { Id: 2, ProductId: 3, Quantity: 2, userId: 1 },
      { Id: 3, ProductId: 5, Quantity: 1, userId: 2 },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Cart', null, {});
  },
};
