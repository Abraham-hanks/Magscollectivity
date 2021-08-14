'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const scopes = require('../../common/utils/seed-data/20210506095802-scopes.json');

module.exports = {
  up: async (queryInterface) => {
    
    scopes.forEach(scope => {
      scope.created_at = new Date();
      scope.updated_at = new Date();
    });

    await queryInterface.bulkInsert('scopes', scopes, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('scopes', null, {});
  }
};
