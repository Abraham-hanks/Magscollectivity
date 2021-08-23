'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await  queryInterface.addColumn('documents', 'product_sub_id', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: 'product_subscriptions',
        key: 'id',
      }
    });
  },
  down: async (queryInterface) => {
    await  queryInterface.removeColumn('documents', 'product_sub_id');
  }
};