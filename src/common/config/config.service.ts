import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { SequelizeOptions } from 'sequelize-typescript';
import { EncryptionObjInterface } from '../constants';

// load dotenv variables
dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public nodeEnv = this.getValue('NODE_ENV', true);
  public isDev: boolean = this.nodeEnv === 'development';
  public isStaging: boolean = this.nodeEnv === 'staging';
  public isProduction: boolean = this.nodeEnv === 'production';

  // get value of key from .env, else throw error
  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getAppName(): string {
    return this.getValue('APP_NAME', true);
  }

  public getAppUrl(): string {
    return this.getValue('APP_URL', true);
  }

  public getAppVersionNo(): string {
    return this.getValue('VERSION_NO', true);
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getApiPrefix() {
    return this.getValue('API_PREFIX', true);
  }

  public getJwtSecret() {
    return this.getValue('JWT_SECRET', true);
  }

  public getExpiresIn() {
    return this.getValue('EXPIRES_IN', true);
  }

  public getDailyCron(): string {
    return this.getValue('DAILY_CRON', false);
  }

  public getRedisUrl(): string {
    return this.getValue('REDIS_URL', true)
  }

  public getElasticeAPIKey(): string {
    return this.getValue('ELASTICE_EMAIL_KEY', true)
  }

  public getPaystackSecretKey(): string {
    return this.getValue('PAYSTACK_SECRET_KEY', true)
  }

  public getWebAppUrl(): string {
    return this.getValue('WEB_APP_URL', true)
  }

  public getSentryDsn(): string {
    return this.getValue('SENTRY_DSN', true)
  }

  public getEncryptionObj(): EncryptionObjInterface {
    return {
      PASSWORD: this.getValue('ENCRYPTION_PASSWORD', true),
      SALT: this.getValue('ENCRYPTION_SALT', true),
    }
  }
  
  // database
  public getPostgresLogging(): boolean {
    try {
      return <boolean><unknown>this.getValue('POSTGRES_LOGGING');
    }
     catch (error) {
      // return default logging value as false
      return false;
    }
  }

  public getDatabaseUrl() {
    return this.getValue('DATABASE_URL', true);
  }

  public getSequelizeConfig(): SequelizeOptions {
    return {
      timezone: this.getValue('POSTGRES_TIMEZONE'),
      dialect: 'postgres',
      logging: false,
      ssl: true
    };
  }
}

// enusre the values exist in .env on app startup, else throw error
const configService = new ConfigService(process.env).ensureValues([
  'DATABASE_URL',
  'JWT_SECRET',
  'REDIS_URL'
]);

export { configService };
