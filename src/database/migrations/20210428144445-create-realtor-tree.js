'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('realtor_trees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      realtor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
        },
      },
      no_customers_referred: {
        type: Sequelize.INTEGER,
      },
      downline: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [],
      },
      indirect_downline: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      },
      completed_sales: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      incompleted_sales: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      completed_sales_value: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      incompleted_sales_value: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      products_sold_ids: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [],
      },
      subscription_sold_ids: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
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
    // .then(() => {
    //   return queryInterface.addIndex('realtor_trees', ['no_customers_referred'])
    // });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('realtor_trees', { cascade: true });
  },
};
