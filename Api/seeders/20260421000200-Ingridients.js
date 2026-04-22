'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Ingridients', [
      {
        Id: 1,
        Name: 'Мука пшеничная',
        Unit: 'кг',
        CostPerUnit: 70.0,
        QuantityInStock: 120.0,
        MinStockLevel: 20.0,
        SupplierName: 'ООО Мельник',
        SupplierPhone: '+79995550011',
        LastUpdated: new Date(),
      },
      {
        Id: 2,
        Name: 'Сливочное масло',
        Unit: 'кг',
        CostPerUnit: 850.0,
        QuantityInStock: 35.0,
        MinStockLevel: 8.0,
        SupplierName: 'Ферма Премиум',
        SupplierPhone: '+79995550022',
        LastUpdated: new Date(),
      },
      {
        Id: 3,
        Name: 'Сливки 33%',
        Unit: 'л',
        CostPerUnit: 420.0,
        QuantityInStock: 25.0,
        MinStockLevel: 5.0,
        SupplierName: 'МолТорг',
        SupplierPhone: '+79995550033',
        LastUpdated: new Date(),
      },
      {
        Id: 4,
        Name: 'Какао-порошок',
        Unit: 'кг',
        CostPerUnit: 680.0,
        QuantityInStock: 16.0,
        MinStockLevel: 4.0,
        SupplierName: 'КакаоМаркет',
        SupplierPhone: '+79995550044',
        LastUpdated: new Date(),
      },
      {
        Id: 5,
        Name: 'Ванильная паста',
        Unit: 'кг',
        CostPerUnit: 2100.0,
        QuantityInStock: 4.0,
        MinStockLevel: 1.0,
        SupplierName: 'Vanilla Pro',
        SupplierPhone: '+79995550055',
        LastUpdated: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Ingridients', null, {});
  },
};
