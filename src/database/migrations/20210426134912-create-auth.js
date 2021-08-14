'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('auths', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      middlename: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true, // for admins
      },
      hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // salt: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      // },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      role_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_login_at: {
        type: Sequelize.DATE,
      },
      login_count: {
        type: Sequelize.INTEGER,
      },
      last_ip: {
        type: Sequelize.STRING,
      },
      last_device_type: {
        type: Sequelize.STRING,
      },
      two_fa_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      two_fa_type: {
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
    }).then(() => {
      return queryInterface.addIndex('auths', ['phone', 'email'])
    });
  },
  down: (queryInterface) => {
    // no need to remove indexes before dropping the table
    return queryInterface.dropTable('auths', { cascade: true });
  },
};
