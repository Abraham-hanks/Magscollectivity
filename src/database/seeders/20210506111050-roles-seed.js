'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const roles = require('../../common/utils/seed-data/20210506111050-roles.json');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    roles.forEach(role => {
      role.created_at = new Date();
      role.updated_at = new Date();
    });

    await queryInterface.bulkInsert('roles', roles, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
