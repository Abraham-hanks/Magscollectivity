'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      auth_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'auths',
          key: 'id',
        },
        allowNull: false,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      middlename: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      dob: {
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other')
      },
      marital_status: {
        type: Sequelize.STRING,
      },
      profile_pic: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      occupation: {
        type: Sequelize.STRING,
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
      country: {
        type: Sequelize.STRING
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      referred_by_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'wallets',
        //   key: 'id',
        // },
      },
      bvn_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      // Next of kin fields
      next_of_kin_full_name: {
        type: Sequelize.STRING
      },
      next_of_kin_phone: {
        type: Sequelize.STRING
      },
      next_of_relationship: {
        type: Sequelize.STRING
      },
      next_of_kin_address: {
        type: Sequelize.STRING
      },

      // realtor related fields

      is_realtor: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_realtor_approved: {
        type: Sequelize.BOOLEAN,
      },
      realtor_stage: {
        type: Sequelize.STRING,
      },
      referral_code: {
        type: Sequelize.STRING,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
      return queryInterface.addIndex('customers', ['phone', 'email', 'auth_id'])
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('customers', { cascade: true });
  },
};
