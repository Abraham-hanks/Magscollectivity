'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const adminWallets = require('../../common/utils/seed-data/20210511161009-admin-wallets.json');

module.exports = {
  up: async (queryInterface) => {

    adminWallets.forEach(adminWallet => {
      adminWallet.created_at = new Date();
      adminWallet.updated_at = new Date();
    });

    await queryInterface.bulkInsert('wallets', adminWallets, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('wallets', null, {});
  }
};
