'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('lgas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: true,
      },
      state_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'states',
          key: 'id',
        },
        allowNull: false
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
      return queryInterface.addIndex('lgas', ['name', 'state_id']);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('lgas', { cascade: true });
  },
};
