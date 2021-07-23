// this file is used by sequeliezrc for migrations and seeders, therefore it is in .js format

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  "development": {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "host": process.env.POSTGRES_HOST,
    "dialect": 'postgres',
    "use_env_variable": "DATABASE_URL",
    "ssl": true
  },
  "staging": {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "host": process.env.POSTGRES_HOST,
    "dialect": 'postgres',
    "use_env_variable": "DATABASE_URL"
  },
  "production": {
    "username": process.env.username,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "host": process.env.POSTGRES_HOST,
    "dialect": 'postgres',
    "use_env_variable": "DATABASE_URL"
  }
};
