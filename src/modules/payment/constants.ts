import { DefaultQueryAttributeExclude } from "src/common/constants";

export const CARD_AUTH_REPOSITORY = 'CARD_AUTH_REPOSITORY';
export const BANK_ACCOUNT_REPOSITORY = 'BANK_ACCOUNT_REPOSITORY';

// paystack
export type PaystackInitiate = {
  email: string;
  amount: string;
  callback_url: string;
  // currency: "NGN"
}

export type NewReceipient = {
  type?: 'nuban';
  name: string;
  description?: string;
  account_number: string;
  bank_code: string;
  currency?: 'NGN';
}

export type PaystackFundsTransfer = {
  source?: 'balance';
  reason?: 'withdrawal';
  amount: number; // in kobo,
  reference: string;
  recipient: string;
}

export type CreateCardAuth = {
  customer_id: number;
  auth_code: string;
  card_type: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  bin?: string;
  bank_name: string;
  bank_id?: number;
  channel?: string;
  signature: string;
  reusable?: boolean;
  country_code?: string;
  account_name: string;
  is_active?: boolean;
}

export const BankAccAtrributesExclude = [ ...DefaultQueryAttributeExclude ];
