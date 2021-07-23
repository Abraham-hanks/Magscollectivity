export const PRODUCT_SUB_REPOSITORY = 'PRODUCT_SUB_REPOSITORY';

export enum PRODUCT_SUB_STATUS {
  initiated = 'initiated',
  on_going = 'on_going', // made 1st payment
  paused = 'paused',
  cancelled = 'cancelled',
  completed = 'completed',
}

export enum PRODUCT_SUB_PAYMENT_METHOD {
  fund_request = 'fund_request',
  paystack = 'paystack',
  wallet = 'wallet',
}