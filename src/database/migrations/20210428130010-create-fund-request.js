'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('fund_requests', {
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
      proof_of_payment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      purpose: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.BIGINT,
      },
      status: {
        type: Sequelize.STRING,
      },
      bank_reference: {
        type: Sequelize.STRING,
      },
      product_sub_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product_subscriptions',
          key: 'id',
        },
      },
      updated_by_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'admins',
          key: 'id',
        },
      },
      comments: {
        type: Sequelize.STRING,
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
        return queryInterface.addIndex('fund_requests', ['product_sub_id'])
      });
    // add indexing
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('fund_requests', { cascade: true });
  },
};
