export enum REQUEST_TYPE {
  DOCUMENT_NAME_CHANGE = 'DOCUMENT_NAME_CHANGE',
  CHANGE_OF_OWNERSHIP = 'CHANGE_OF_OWNERSHIP',
  CHANGE_OF_NAME = 'CHANGE_OF_NAME',
  CHANGE_OF_LOCATION = 'CHANGE_OF_LOCATION',
  CHANGE_OF_PAYMENT_PLAN = 'CHANGE_OF_PAYMENT_PLAN',
  OTHER = 'OTHER',
};

export enum PAYMENT_TYPE {
  out_right = 'out_right',
  installment = 'installment',
};

export enum REQUEST_STATUS {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  DISAPPROVED = 'DISAPPROVED',
}

export const CHANGE_REQUEST_REPOSITORY = 'CHANGE_REQUEST_REPOSITORY';