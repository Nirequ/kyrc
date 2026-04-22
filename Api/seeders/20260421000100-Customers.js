'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Customers', [
      {
        Id: 1,
        FullName: 'Иван Петров',
        Phone: '+79990000001',
        Email: 'ivan.petrov@example.com',
        Address: 'г. Уфа, ул. Ленина, д. 10',
        RegisteredAt: new Date(),
      },
      {
        Id: 2,
        FullName: 'Мария Смирнова',
        Phone: '+79990000002',
        Email: 'maria.smirnova@example.com',
        Address: 'г. Уфа, ул. Гагарина, д. 5',
        RegisteredAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Customers', null, {});
  },
};
