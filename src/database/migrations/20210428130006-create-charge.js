'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('charges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
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
      product_sub_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product_subscriptions',
          key: 'id',
        },
      },
      change_request_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'change_requests',
          key: 'id',
        },
      },
      amount: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      date_due: {
        type: Sequelize.DATE,
      },
      created_by_id: {
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
    }).then(() => {
      return queryInterface.addIndex('charges', ['customer_id', 'product_sub_id', 'change_request_id'])
    });
    // add indexing
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('charges', { cascade: true });
  },
};
