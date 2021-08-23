import { DefaultQueryAttributeExclude } from "src/common/constants";

export const WALLET_REPOSITORY = 'WALLET_REPOSITORY';

export enum ADMIN_WALLETS {
  WITHHOLDING_TAX = 'WITHHOLDING_TAX',
  PRODUCT_PAYMENT = 'PRODUCT_PAYMENT',
  COMPANY_COMMISSION = 'COMPANY_COMMISSION',
}

export const WalletAttributesExclude = ['is_admin_wallet', ...DefaultQueryAttributeExclude];

export type CreditDebitRes = {
  oldBal: string;
  newBal: string;
  customer_id: number;
  isAdminWallet?: boolean
}