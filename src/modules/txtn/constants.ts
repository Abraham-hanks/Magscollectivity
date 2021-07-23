// do not change enum values as they are used by the db

import { DefaultQueryAttributeExclude } from "src/common/constants";

export enum TXTN_TYPE {
  product_payment = 'product_payment',
  commission = 'commission',
  product_subscription = 'product_subscription',
  charge_payment = 'charge_payment',
  funding = 'funding',
  withdrawal = 'withdrawal',
  reversal = 'reversal',
};

export enum TXTN_CHANNEL {
  card = 'card',
  wallet = 'wallet',
  fund_request = 'fund_request',
  // bank_account = 'bank_account',
  bank = 'bank',
  ussd = 'ussd',
  // 'system' // d
};

export enum TXTN_POSITION {
  credit = 'credit',
  debit = 'debit',
  // other = 'other' // e.g product purchase
};

export enum TXTN_STATUS {
  initiated = 'initiated',
  success = 'success',
  pending = 'pending',
  failed = 'failed'
};

export const TXTN_REPOSITORY = 'TXTN_REPOSITORY';
export const FUND_REQUEST_REPOSITORY = 'FUND_REQUEST_REPOSITORY';
export const WITHDRAWAL_REQUEST_REPOSITORY = 'WITHDRAWAL_REQUEST_REPOSITORY';

// queues
export const TXTN_QUEUE = 'TRANSACTION_QUEUE';
export const NEW_TXTN_JOB = 'NEW_TXTN_JOB';
export const RESOLVE_PYSTK_WEBHOOK = 'RESOLVE_PYSTK_WEBHOOK';
export const APPROVE_FUND_REQUEST = 'APPROVE_FUND_REQUEST';
export const APPROVE_WITHDRAWAL_REQUEST = 'APPROVE_WITHDRAWAL_REQUEST';
export const PRODUCT_SUB_PAYMENT_FROM_WALLET = 'PRODUCT_SUB_PAYMENT_FROM_WALLET';

// fund request
export enum FUND_REQUEST_STATUS {
  initiated = 'initiated',
  approved = 'approved',
  declined = 'declined'
}

export enum FUND_REQUEST_PURPOSE {
  wallet_funding = 'wallet_funding',
  product_sub_payment = 'product_sub_payment'
}

export enum WITHDRAWAL_REQUEST_STATUS {
  initiated = 'initiated',
  approved = 'approved',
  processed = 'processed', // approve req has been processed successfully
  declined = 'declined'
}

export const TxtnAttributesExclude = [ 'paystack_auth', ...DefaultQueryAttributeExclude];

export const formatTransactionAmount = (amount): any => {
  if (!amount) {
   return "0"
  }
  const value = parseInt(amount) / 100;
  return value.toString();
  // // check if amount is a decimal number
  // const isDecimal = amount.includes(".");
  // // get the number before the point
  // const nonDecimalValue = isDecimal ? amount.split(".")[0] : amount;
 
  // let countHelper = 1; 
  // let formattedCurrency = "";
  // //start adding from the last number
  // let index = nonDecimalValue.length - 1;
  // for (index; index >= 0; index--) {
  //   // check if 3 numbers have been added and the first number has not been added
  //   if (countHelper % 3 === 0 && countHelper !== nonDecimalValue.length)
  //     formattedCurrency = "," + nonDecimalValue[index] + formattedCurrency;
    
  //   else
  //     formattedCurrency = nonDecimalValue[index] + formattedCurrency;
  
  //   countHelper++
  // }

  // // console.log(value)
  // //console.log(`${formattedCurrency}.${amount.split(".")[1]}` )
  // return isDecimal ? `${currency} ${formattedCurrency}.${amount.split(".")[1]}` : `${currency} ${formattedCurrency}.00`;
}
