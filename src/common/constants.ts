import { getCurrentDate } from "./utils/date-processor";

export const SEQUELIZE = 'SEQUELIZE';
export const HTTP_OK_STRING = 'ok';
export const DefaultQueryAttributeExclude = ['deleted_at', 'updated_at', 'meta'];

export const USER_HEADERS = [
  { name: 'email', description: 'email' },
  { name: 'password', description: 'password' },
]

export const CURRENT_DATE = getCurrentDate();
export const DATE_TIME_FORMAT = 'dddd, DD-MMM-YYYY, h:mm:ssa';

export type EncryptionObjInterface = {
  PASSWORD: string,
  SALT: string,
  // IV?: string
}

// commision
export enum COMMISSION_RATE {
  total = 30,  // total commission to be shared
  inactive_ambassador = 10,
  ambassador = 15,
  gold = 20,
  diamond = 25,
  realtor = 5,
  company = 5,
  company_reservation = 5
};

export const appModules = {
  AdminController: 'AdminModule',
  AuthController: 'AuthModule',
  ChangeRequestController: 'ChangeRequestModule',
  ChargeController: 'ChargeModule',
  CustomerController: 'CustomerModule',
  RealtorTreeController: 'CustomerModule',
  BankAccountController: 'PaymentModule',
  CardAuthController: 'PaymentModule',
  WebhookController: 'PaymentModule',
  PaymentPlanController: 'ProductModule',
  ProductController: 'ProductModule',
  ProductSubController: 'ProductSubscriptionModule',
  RoleController: 'RoleModule',
  TxtnController:'TxtnModule',
  AuditController: 'UtilityModule',
  LgaController: 'UtilityModule',
  StateController: 'UtilityModule',
}
