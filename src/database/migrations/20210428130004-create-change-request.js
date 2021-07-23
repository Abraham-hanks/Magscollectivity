'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('change_requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
        },
        allowNull: false,
      },
      product_sub_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product_subscriptions',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      comments: {
        type: Sequelize.STRING,
      },
      approved_on: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      updated_by_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'admins',
          key: 'id',
        },
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
    })
      .then(() => {
        return queryInterface.addIndex('change_requests', ['product_sub_id', 'customer_id'])
      });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('change_requests', { cascade: true });
  },
};
