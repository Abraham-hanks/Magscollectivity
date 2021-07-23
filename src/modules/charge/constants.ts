export const CHARGE_REPOSITORY = "CHARGE_REPOSITORY";
export const CHARGE_SUBSCRIPTION_REPOSITORY = "CHARGE_SUBSCRIPTION_REPOSITORY";

// export enum CHARGE_TYPE {
//     flat_rate = 'flat_rate',
//     // percentage = 'percentage'
// }

export enum CHARGE_SUBSCRIPTION_STATUS {
  active = 'active',
  paused = 'paused', 
  cancelled = 'cancelled',
  completed = 'completed',
};

export enum CHARGE_TYPE {
    service_charge = 'service_charge',
    payment_default_charge = 'payment_default_charge',
    change_request_charge = 'change_request_charge',
    other = 'other'
}

export enum CHARGE_STATUS {
    initiated = 'initiated',
    on_going = 'on_going', // made 1st payment
    paused = 'paused',
    cancelled = 'cancelled',
    completed = 'completed',
}