import { StringLiteral } from "@babel/types";
import { DefaultQueryAttributeExclude } from "src/common/constants";

export const WALLET_REPOSITORY = 'WALLET_REPOSITORY';

export enum ADMIN_WALLETS {
  PRODUCT_PAYMENT = 'PRODUCT_PAYMENT',
  COMPANY_COMMISSION = 'COMPANY_COMMISSION',
  COMPANY_RESERVATION = 'COMPANY_RESERVATION'
}

export const WalletAttributesExclude = ['is_admin_wallet', ...DefaultQueryAttributeExclude];

export type CreditDebitRes = {
  oldBal: string;
  newBal: string;
  customer_id: number;
  isAdminWallet?: boolean
}