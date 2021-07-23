'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const states = require('../../common/utils/seed-data/20210511140952-states.json');

module.exports = {
  up: async (queryInterface) => {

    states.forEach(state => {
      state.created_at = new Date();
      state.updated_at = new Date();
    });

    await queryInterface.bulkInsert('states', states, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('states', null, {});
  }
};
