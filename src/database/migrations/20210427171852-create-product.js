'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      description: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
        // allowNull: false
      },
      state_name: {
        type: Sequelize.STRING
      },
      lga_name: {
        type: Sequelize.STRING
      },
      // state_id & lga_id added for query-filters
      state_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'states',
          key: 'id',
        },
      },
      lga_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'lgas',
          key: 'id',
        },
      },
      unit_price: {
        type: Sequelize.BIGINT,  // kobo value
        allowNull: false,
      },
      total_units: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      available_units: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      can_cancel_subscription: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      can_pause_subscription: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      size_per_unit: {
        type: Sequelize.STRING,
      },
      features: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      coordinates: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      shd_pay_commission: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      locked_fields: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      // subscription_status: {
      //   type: Sequelize.STRING
      // },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      property_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
      return queryInterface.addIndex('products', ['name', 'state_id', 'lga_id', 'unit_price'])
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('products', { cascade: true });
  },
};
