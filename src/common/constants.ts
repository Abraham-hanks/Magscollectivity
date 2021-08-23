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
export const PRODUCT_PAYMENT = 80;
export const WITHHOLDINGTAX = 5;  //Withholding Tax percentage on every product sub payment
export const REALTOR_COMMISSION = 10;
export const CUSTOMER_COMMISSION = 5;

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
