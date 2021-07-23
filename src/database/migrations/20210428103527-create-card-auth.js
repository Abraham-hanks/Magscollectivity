'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('card_auths', {
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
      // paystack_sub_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      // },
      auth_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      card_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last4: {
        type: Sequelize.STRING,
        allowNull: false
      },
      exp_month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      exp_year: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bin: {
        type: Sequelize.STRING
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      channel: {
        type: Sequelize.STRING
      },
      signature: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reusable: {
        type: Sequelize.BOOLEAN
      },
      country_code: {
        type: Sequelize.STRING,
      },
      account_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
      return queryInterface.addIndex('card_auths', ['customer_id'])
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('card_auths', { cascade: true });
  },
};
