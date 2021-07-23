'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lgas = require('../../common/utils/seed-data/20210511141007-lgas.json');

module.exports = {
  up: async (queryInterface) => {

    lgas.forEach(lga => {
      lga.created_at = new Date();
      lga.updated_at = new Date();
    });

    await queryInterface.bulkInsert('lgas', lgas, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('lgas', null, {});
  }
};
