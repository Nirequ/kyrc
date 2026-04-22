'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('User', 'geoLat', {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true,
    });

    await queryInterface.addColumn('User', 'geoLng', {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true,
    });

    await queryInterface.addColumn('User', 'geoAddress', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('User', 'geoAddress');
    await queryInterface.removeColumn('User', 'geoLng');
    await queryInterface.removeColumn('User', 'geoLat');
  },
};
