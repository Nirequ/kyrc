'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Orders', [
      {
        Id: 1,
        CustomerId: 1,
        OrderDate: new Date(),
        DeliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        TotalAmount: 1710.0,
        Status: 'new',
        Comment: 'Доставка к 18:00',
      },
      {
        Id: 2,
        CustomerId: 2,
        OrderDate: new Date(),
        DeliveryDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        TotalAmount: 5240.0,
        Status: 'confirmed',
        Comment: 'Позвонить за час до доставки',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Orders', null, {});
  },
};
