import { TXTN_TYPE } from "../txtn/constants";

export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';
export const REALTOR_TREE_REPOSITORY = 'REALTOR_TREE_REPOSITORY';

export enum ENUM_GENDER {
  male = 'male',
  female = 'female',
  other = 'other'
}

export enum REALTOR_STAGE {
  referral = 'referral',
  inactive_ambassador = 'inactive_ambassador',
  ambassador = 'ambassador',
  gold = 'gold',
  diamond = 'diamond'
}

export const CustomerAttributeIncludeFields = ['id', 'firstname', 'lastname', 'phone', 'email', 'is_realtor', 'realtor_stage', 'referred_by_id'];
export const BasicCustomerAttributeIncludeFields = ['id', 'firstname', 'lastname', 'phone', 'email'];


export type CreateRealtorTree = {
  realtor_id: number;
  // 
  downline?: [];

  indirect_downline?: [];

  no_customers_referred?: number;

  no_direct_sales?: number;

  no_indirect_sales?: number;

  value_direct_sales?: string;

  value_indirect_sales?: string;
}

export enum MARITAL_STATUS {
  married = 'married',
  single = 'single',
}

export type CommissionPmt = {
  wallet_id: number,
  amount: number,
  type?: TXTN_TYPE
}
