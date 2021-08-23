'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // sub_type: {
      //   type: Sequelize.STRING,
      // },
      channel: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wallets',
          key: 'id',
        },
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
        },
      },
      admin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'admins',
          key: 'id',
        },
      },
      fund_request_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'fund_requests',
          key: 'id',
        },
      },
      withdrawal_request_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'withdrawal_requests',
          key: 'id',
        },
      },
      charge_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'charges',
          key: 'id',
        },
      },
      product_sub_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product_subscriptions',
          key: 'id',
        },
      },
      total_amount: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      actual_amount: {
        type: Sequelize.BIGINT,
      },
      charges: {
        type: Sequelize.BIGINT,
      },
      old_balance: {
        type: Sequelize.BIGINT,
      },
      new_balance: {
        type: Sequelize.BIGINT,
      },
      position: {
        type: Sequelize.ENUM('credit', 'debit'),
      },
      is_admin_txtn: {
        type: Sequelize.BOOLEAN,
      },
      status: {
        type: Sequelize.STRING
      },
      paystack_auth: {
        type: Sequelize.JSON,
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
      return queryInterface.addIndex('transactions', 
        ['reference', 'wallet_id', 'customer_id', 'channel', 'charge_id', 'product_sub_id'])
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('transactions', { cascade: true });
  },
};
