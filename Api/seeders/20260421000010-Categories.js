'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Categories', [
      { Id: 1, Name: 'Торты', Description: 'Классические и праздничные торты' },
      { Id: 2, Name: 'Пирожные', Description: 'Порционные десерты' },
      { Id: 3, Name: 'Выпечка', Description: 'Круассаны, булочки и слоеные изделия' },
      { Id: 4, Name: 'Эклеры', Description: 'Эклеры с разными начинками' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
