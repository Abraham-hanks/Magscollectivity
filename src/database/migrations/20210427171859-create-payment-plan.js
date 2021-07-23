'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('payment_plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id',
        },
        allowNull: false,
      },
      minimun_no_units: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      minimun_deposit_amount: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      amount_per_unit: {
        type: Sequelize.BIGINT,  // kobo value
        allowNull: false,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_by_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'admins',
          key: 'id',
        },
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
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
      return queryInterface.addIndex('payment_plans', ['product_id'])
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('payment_plans', { cascade: true });
  },
};
