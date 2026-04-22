'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      Id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      FullName: { type: Sequelize.STRING(100), allowNull: false },
      Phone: { type: Sequelize.STRING(20), allowNull: false },
      Email: { type: Sequelize.STRING(100), allowNull: true },
      Address: { type: Sequelize.TEXT, allowNull: true },
      RegisteredAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('Customers', {
      fields: ['Phone'],
      type: 'unique',
      name: 'UQ_Customers_Phone',
    });

    await queryInterface.createTable('Categories', {
      Id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      Name: { type: Sequelize.STRING(50), allowNull: false },
      Description: { type: Sequelize.TEXT, allowNull: true },
    });
    await queryInterface.addConstraint('Categories', {
      fields: ['Name'],
      type: 'unique',
      name: 'UQ_Categories_Name',
    });

    await queryInterface.createTable('Ingridients', {
      Id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      Name: { type: Sequelize.STRING(100), allowNull: false },
      Unit: { type: Sequelize.STRING(20), allowNull: false },
      CostPerUnit: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      QuantityInStock: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      MinStockLevel: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      SupplierName: { type: Sequelize.STRING(100), allowNull: true },
      SupplierPhone: { type: Sequelize.STRING(20), allowNull: true },
      LastUpdated: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('Ingridients', {
      fields: ['Name'],
      type: 'unique',
      name: 'UQ_Ingridients_Name',
    });

    await queryInterface.createTable('Products', {
      Id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      Name: { type: Sequelize.STRING(100), allowNull: false },
      CategoryId: { type: Sequelize.INTEGER, allowNull: true },
      Description: { type: Sequelize.TEXT, allowNull: true },
      Price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      Weight: { type: Sequelize.INTEGER, allowNull: true },
      IsCustom: { type: Sequelize.BOOLEAN, defaultValue: false },
      ImageUrl: { type: Sequelize.STRING(255), allowNull: true },
      CreatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('Products', {
      fields: ['CategoryId'],
      type: 'foreign key',
      name: 'FK_Products_Categories',
      references: { table: 'Categories', field: 'Id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      login: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
    await queryInterface.addConstraint('User', {
      fields: ['login'],
      type: 'unique',
      name: 'UQ_User_login',
    });

    await queryInterface.createTable('Orders', {
      Id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      CustomerId: { type: Sequelize.INTEGER, allowNull: true },
      OrderDate: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      DeliveryDate: { type: Sequelize.DATE, allowNull: false },
      TotalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      Status: { type: Sequelize.STRING(20), defaultValue: 'new' },
      Comment: { type: Sequelize.TEXT, allowNull: true },
    });
    await queryInterface.addConstraint('Orders', {
      fields: ['CustomerId'],
      type: 'foreign key',
      name: 'FK_Orders_Customers',
      references: { table: 'Customers', field: 'Id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.createTable('Cart', {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
    await queryInterface.addConstraint('Cart', {
      fields: ['ProductId'],
      type: 'foreign key',
      name: 'FK_cart_products',
      references: {
        table: 'Products',
        field: 'Id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
    await queryInterface.addConstraint('Cart', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'FK_cart_user',
      references: {
        table: 'User',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.createTable('OrderItems', {
      Id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      OrderId: { type: Sequelize.INTEGER, allowNull: false },
      ProductId: { type: Sequelize.INTEGER, allowNull: false },
      Quantity: { type: Sequelize.INTEGER, allowNull: false },
      PriceAtOrder: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      CustomOptions: { type: Sequelize.TEXT, allowNull: true },
    });
    await queryInterface.addConstraint('OrderItems', {
      fields: ['OrderId'],
      type: 'foreign key',
      name: 'FK_OrderItems_Orders',
      references: { table: 'Orders', field: 'Id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('OrderItems', {
      fields: ['ProductId'],
      type: 'foreign key',
      name: 'FK_OrderItems_Products',
      references: { table: 'Products', field: 'Id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.createTable('ProductsIngridients', {
      ProductId: { type: Sequelize.INTEGER, allowNull: false },
      IngridientId: { type: Sequelize.INTEGER, allowNull: false },
      Quantity: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    });
    await queryInterface.addConstraint('ProductsIngridients', {
      fields: ['ProductId', 'IngridientId'],
      type: 'primary key',
      name: 'PK_ProductsIngridients',
    });
    await queryInterface.addConstraint('ProductsIngridients', {
      fields: ['ProductId'],
      type: 'foreign key',
      name: 'FK_ProdIng_Products',
      references: { table: 'Products', field: 'Id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('ProductsIngridients', {
      fields: ['IngridientId'],
      type: 'foreign key',
      name: 'FK_ProdIng_Ingridients',
      references: { table: 'Ingridients', field: 'Id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ProductsIngridients');
    await queryInterface.dropTable('OrderItems');
    await queryInterface.dropTable('Cart');
    await queryInterface.dropTable('Orders');
    await queryInterface.dropTable('User');
    await queryInterface.dropTable('Products');
    await queryInterface.dropTable('Ingridients');
    await queryInterface.dropTable('Categories');
    await queryInterface.dropTable('Customers');
  },
};
