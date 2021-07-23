'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
        },
        allowNull: false,
      },
      created_by_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'admins',
          key: 'id',
        },
        allowNull: false,
      },
      updated_by_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'admins',
          key: 'id',
        },
        // allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      meta: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }).then(() => {
      return queryInterface.addIndex('documents', ['name', 'customer_id'])
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('documents');
  },
};
