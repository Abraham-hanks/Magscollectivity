'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      auth_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'auths',
          key: 'id',
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      txtn_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'transactions',
          key: 'id',
        },
      },
      expires_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      // is_active: {
      //   type: Sequelize.BOOLEAN,
      //   defaultValue: true,
      // },
      is_expired: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      valid_for: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      no_of_xters: {
        type: Sequelize.INTEGER,
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
      return queryInterface.addIndex('tokens', ['auth_id'])
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('tokens', { cascade: true });
  },
};
