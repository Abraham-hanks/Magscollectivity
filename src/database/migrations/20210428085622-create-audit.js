'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('audits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      label: {
        type: Sequelize.STRING,
      },
      auth_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'auths',
          key: 'id',
        },
      },
      item_id: {
        type: Sequelize.STRING,
      },
      module: {
        type: Sequelize.STRING,
      },
      request_body: {
        type: Sequelize.TEXT,
      },
      response_body: {
        type: Sequelize.TEXT,
      },
      response_message: {
        type: Sequelize.STRING,
      },
      status_code: {
        type: Sequelize.INTEGER,
      },
      controller_method: {
        type: Sequelize.STRING,
      },
      request_method: {
        type: Sequelize.STRING,
      },
      request_url: {
        type: Sequelize.STRING,
      },
      user_agent: {
        type: Sequelize.STRING,
        // allowNull: true,
      },
      ip_address: {
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
      return queryInterface.addIndex('audits', ['auth_id'])
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('audits');
  },
};
