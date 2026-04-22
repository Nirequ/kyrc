'use strict';
const md5 = require('md5');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('User', [
      {
        id: 1,
        login: 'admin',
        password: md5('12345'),
        firstName: 'Иван',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        login: 'customer',
        password: md5('12345'),
        firstName: 'Мария',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('User', null, {});
  },
};
