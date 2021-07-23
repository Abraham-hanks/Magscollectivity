// this file is used by sequelizerc, therefore it is in .js format

import { Sequelize } from 'sequelize';
import { getSequelizeConfig as dbConfig } from '../../common/config/config.service';

export let sequelize;

if (config.url) {
  sequelize = new Sequelize(dbConfig().url, dbConfig());
} else {
  sequelize = new Sequelize(
    dbConfig().database,
    dbConfig().username,
    config().password,
    config(),
  );
}
