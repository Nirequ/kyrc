'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Products', [
      {
        Id: 1,
        Name: 'Торт "Красный бархат"',
        CategoryId: 1,
        Description: 'Классический десерт с нежным кремом',
        Price: 1500.0,
        Weight: 1000,
        IsCustom: false,
        ImageUrl: 'none',
        CreatedAt: new Date(),
      },
      {
        Id: 2,
        Name: 'Набор Макаронс (6 шт)',
        CategoryId: 2,
        Description: 'Разноцветные французские пирожные',
        Price: 600.0,
        Weight: 150,
        IsCustom: false,
        ImageUrl: 'none',
        CreatedAt: new Date(),
      },
      {
        Id: 3,
        Name: 'Круассан классический',
        CategoryId: 3,
        Description: 'Свежеиспеченный на сливочном масле',
        Price: 120.0,
        Weight: 80,
        IsCustom: false,
        ImageUrl: 'none',
        CreatedAt: new Date(),
      },
      {
        Id: 4,
        Name: 'Свадебный торт (на заказ)',
        CategoryId: 1,
        Description: 'Индивидуальный дизайн и начинка',
        Price: 5000.0,
        Weight: 3000,
        IsCustom: true,
        ImageUrl: 'none',
        CreatedAt: new Date(),
      },
      {
        Id: 5,
        Name: 'Эклер ванильный',
        CategoryId: 4,
        Description: 'Заварной эклер с ванильным кремом',
        Price: 210.0,
        Weight: 90,
        IsCustom: false,
        ImageUrl: 'none',
        CreatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Products', null, {});
  },
};
