'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('OrderItems', [
      {
        Id: 1,
        OrderId: 1,
        ProductId: 1,
        Quantity: 1,
        PriceAtOrder: 1500.0,
        CustomOptions: 'Без орехов',
      },
      {
        Id: 2,
        OrderId: 1,
        ProductId: 5,
        Quantity: 1,
        PriceAtOrder: 210.0,
        CustomOptions: null,
      },
      {
        Id: 3,
        OrderId: 2,
        ProductId: 4,
        Quantity: 1,
        PriceAtOrder: 5000.0,
        CustomOptions: 'Надпись "С днем свадьбы"',
      },
      {
        Id: 4,
        OrderId: 2,
        ProductId: 3,
        Quantity: 2,
        PriceAtOrder: 120.0,
        CustomOptions: null,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('OrderItems', null, {});
  },
};
