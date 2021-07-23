export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
export const PAYMENT_PLAN_REPOSITORY = 'PAYMENT_PLAN_REPOSITORY';

export enum PRODUCT_STATUS {
  open = 'open',  // open for subscription
  closed = 'closed',  // not open for subscription
  ended = 'ended'
};

export enum PAYMENT_PLAN_TYPE {
  out_right = 'out_right',
  installment = 'installment',
};

export enum PROPERTY_TYPE {
  land = 'land',
  house = 'house',
  other = 'other'
}
