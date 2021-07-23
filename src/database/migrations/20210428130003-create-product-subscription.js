'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_subscriptions', {
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
      },
      units: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      actual_amount: {
        type: Sequelize.BIGINT,
      },
      amount_paid: {
        type: Sequelize.BIGINT,
      },
      
      // payment plan details
      amount_per_unit: {
        type: Sequelize.BIGINT,
      },
      is_installment: {
        type: Sequelize.BOOLEAN,
      },
      duration: {
        type: Sequelize.INTEGER,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      next_deduction_date: {
        type: Sequelize.DATE,
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id',
        },
        allowNull: false,
      },
      // promotion_id: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'promotions',
      //     key: 'id',
      //   },
      // },
      
      payment_plan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'payment_plans',
          key: 'id',
        },
        allowNull: false,
      },
      // discount
      is_discounted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      discounted_percentage: {
        type: Sequelize.INTEGER,
      },
      discounted_price: {
        type: Sequelize.BIGINT,
      },
      discount_type: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
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
      return queryInterface.addIndex('product_subscriptions',
        ['customer_id', 'product_id', 'next_deduction_date', 'start_date', 'end_date', 'status']
      )
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('product_subscriptions', { cascade: true });
  },
};
