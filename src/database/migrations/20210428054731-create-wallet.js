'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.createTable('wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      balance: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      book_balance: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      vba_no: {
        type: Sequelize.STRING,
      },
      // auth_id: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'auths',
      //     key: 'id',
      //   },
      // },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
        },
      },
      // admin_id: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'admins',
      //     key: 'id',
      //   },
      // },
      is_admin_wallet: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('wallets', { cascade: true });
  },
};
