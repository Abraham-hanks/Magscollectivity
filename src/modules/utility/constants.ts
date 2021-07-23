import * as moment from 'moment';
export enum TokenTypes {
  auth = 'auth',
  email_verification = 'email_verification',
  two_fa = 'two_fa',
  txtn = 'txtn',
  forgot_password = 'forgot_password',
}

export type ValidateToken = {
  auth_id: number,
  value: string,
  type: TokenTypes
}

export type RegenerateToken = {
  auth_id: number,
  type: TokenTypes,
  // no_of_xters: number
}

export const AUDIT_REPOSITORY = 'AUDIT_REPOSITORY';
export const BANK_REPOSITORY = 'BANK_REPOSITORY';
export const LGA_REPOSITORY = 'LGA_REPOSITORY';
export const STATE_REPOSITORY = 'STATE_REPOSITORY';
export const TOKEN_REPOSITORY = 'TOKEN_REPOSITORY';

export const EMAIL_QUEUE = 'EMAIL_QUEUE';
export const SEND_EMAIL = 'SEND_EMAIL';

export const NO_XTERS_EMAIL_TOKEN = 12;

export type EmailObj = {
  to: string;
  subject: string;
  templateId?: string;
  templateName: string;
  templatePayload: any;
  from?: string;
  type?: string;
}


export const formatDateForEmail = (date: Date) :string => {
  return  moment(date).format("Do MMM, YYYY")
}

export const formatCurrencyForEmail = (amount: string, currency = "NGN") => {
  const value = parseInt(amount) / 100;
  amount = value.toString();
 
  let countHelper = 1; 
  let formattedCurrency = "";
  
  let index = amount.length - 1;
  for (index; index >= 0; index--) {
    if (countHelper % 3 === 0 && countHelper !== amount.length)
      formattedCurrency = "," + amount[index] + formattedCurrency;
    
    else
      formattedCurrency = amount[index] + formattedCurrency;
  
    countHelper++
  }

  return `${currency} ${formattedCurrency}.00`;
}