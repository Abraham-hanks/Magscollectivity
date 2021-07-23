export enum SCOPES {
  READ_SCOPE = 'read_scope',
  WRITE_SCOPE = 'write_scope',
  MODIFY_SCOPE = 'modify_scope',
  DEACTIVATE_SCOPE = 'deactivate_scope',
  ACTIVATE_SCOPE = 'activate_scope',

  READ_ROLE = 'read_role',
  WRITE_ROLE = 'write_role',
  MODIFY_ROLE = 'modify_role',
  DEACTIVATE_ROLE = 'deactivate_role',
  ACTIVATE_ROLE = 'activate_role',

  READ_CUSTOMER = 'read_customer',
  WRITE_CUSTOMER = 'write_customer',
  MODIFY_CUSTOMER = 'modify_customer',
  DEACTIVATE_CUSTOMER = 'deactivate_customer',
  ACTIVATE_CUSTOMER = 'activate_customer',
  IS_CUSTOMER = 'is_customer',
  IS_REALTOR = 'is_realtor',
  IS_CUSTOMER_OR_REALTOR = 'is_customer_or_realtor',

  READ_ADMIN = 'read_admin',
  WRITE_ADMIN = 'write_admin',
  MODIFY_ADMIN = 'modify_admin',
  DEACTIVATE_ADMIN = 'deactivate_admin',
  ACTIVATE_ADMIN = 'activate_admin',
  IS_ADMIN = 'is_admin',
  IS_SUPER_ADMIN = 'is_super_admin',

  READ_PRODUCT = 'read_product',
  WRITE_PRODUCT = 'write_product',
  MODIFY_PRODUCT = 'modify_product',
  DEACTIVATE_PRODUCT = 'deactivate_product',
  ACTIVATE_PRODUCT = 'activate_product',

  READ_PAYMENT_PLAN = 'read_payment_plan',
  WRITE_PAYMENT_PLAN = 'write_payment_plan',
  MODIFY_PAYMENT_PLAN = 'modify_payment_plan',
  DEACTIVATE_PAYMENT_PLAN = 'deactivate_payment_plan',
  ACTIVATE_PAYMENT_PLAN = 'activate_payment_plan',

  READ_DOCUMENT = 'read_document',
  WRITE_DOCUMENT = 'write_document',
  MODIFY_DOCUMENT = 'modify_document',
  DEACTIVATE_DOCUMENT = 'deactivate_document',
  ACTIVATE_DOCUMENT = 'activate_document',

  READ_PRODUCT_SUBSCRIPTION = 'read_product_subscription',
  WRITE_PRODUCT_SUBSCRIPTION = 'write_product_subscription',
  MODIFY_PRODUCT_SUBSCRIPTION = 'modify_product_subscription',
  DEACTIVATE_PRODUCT_SUBSCRIPTION = 'deactivate_product_subscription',
  ACTIVATE_PRODUCT_SUBSCRIPTION = 'activate_product_subscription',

  READ_WALLET = 'read_wallet',
  WRITE_WALLET = 'write_wallet',
  MODIFY_WALLET = 'modify_wallet',
  DEACTIVATE_WALLET = 'deactivate_wallet',
  ACTIVATE_WALLET = 'activate_wallet',
  FUND_WALLET = 'fund_wallet',
  READ_ADMIN_WALLET = 'read_admin_wallet',

  READ_LISTING = 'read_listing',
  WRITE_LISTING = 'write_listing',
  MODIFY_LISTING = 'modify_listing',
  DEACTIVATE_LISTING = 'deactivate_listing',
  ACTIVATE_LISTING = 'activate_listing',

  READ_REALTOR_TREE = 'read_realtor_tree',
  WRITE_REALTOR_TREE = 'write_realtor_tree',
  MODIFY_REALTOR_TREE = 'modify_realtor_tree',
  DEACTIVATE_REALTOR_TREE = 'deactivate_realtor_tree',
  ACTIVATE_REALTOR_TREE = 'activate_realtor_tree',

  READ_REFERRAL = 'read_referral',
  WRITE_REFERRAL = 'write_referral',
  MODIFY_REFERRAL = 'modify_referral',
  DEACTIVATE_REFERRAL = 'deactivate_referral',
  ACTIVATE_REFERRAL = 'activate_referral',

  READ_CHANGE_REQUEST = 'read_change_request',
  WRITE_CHANGE_REQUEST = 'write_change_request',
  MODIFY_CHANGE_REQUEST = 'modify_change_request',
  DEACTIVATE_CHANGE_REQUEST = 'deactivate_change_request',
  ACTIVATE_CHANGE_REQUEST = 'activate_change_request',

  READ_CHARGE = 'read_charge',
  WRITE_CHARGE = 'write_charge',
  MODIFY_CHARGE = 'modify_charge',
  DEACTIVATE_CHARGE = 'deactivate_charge',
  ACTIVATE_CHARGE = 'activate_charge',

  READ_NETWORK = 'read_network',
  WRITE_NETWORK = 'write_network',
  MODIFY_NETWORK = 'modify_network',
  DEACTIVATE_NETWORK = 'deactivate_network',
  ACTIVATE_NETWORK = 'activate_network',

  READ_BANK_ACCOUNT = 'read_bank_account',
  WRITE_BANK_ACCOUNT = 'write_bank_account',
  MODIFY_BANK_ACCOUNT = 'modify_bank_account',
  DEACTIVATE_BANK_ACCOUNT = 'deactivate_bank_account',
  ACTIVATE_BANK_ACCOUNT = 'activate_bank_account',

  READ_HOUSE_PLAN = 'read_house_plan',
  WRITE_HOUSE_PLAN = 'write_house_plan',
  MODIFY_HOUSE_PLAN = 'modify_house_plan',
  DEACTIVATE_HOUSE_PLAN = 'deactivate_house_plan',
  ACTIVATE_HOUSE_PLAN = 'activate_house_plan',

  READ_TRANSACTION = 'read_transaction',
  WRITE_TRANSACTION = 'write_transaction',
  MODIFY_TRANSACTION = 'modify_transaction',
  DEACTIVATE_TRANSACTION = 'deactivate_transaction',
  ACTIVATE_TRANSACTION = 'activate_transaction',
  
  READ_FUND_REQUEST = 'read_fund_request',
  WRITE_FUND_REQUEST = 'write_fund_request',
  MODIFY_FUND_REQUEST = 'modify_fund_request',
  DEACTIVATE_FUND_REQUEST = 'deactivate_fund_request',
  ACTIVATE_FUND_REQUEST = 'activate_fund_request',

  READ_CHARGE_SUBSCRIPTION = 'read_charge_subscription',
  WRITE_CHARGE_SUBSCRIPTION = 'write_charge_subscription',
  MODIFY_CHARGE_SUBSCRIPTION = 'modify_charge_subscription',
  DEACTIVATE_CHARGE_SUBSCRIPTION = 'deactivate_charge_subscription',
  ACTIVATE_CHARGE_SUBSCRIPTION = 'activate_charge_subscription',

  READ_CARD_AUTH= 'read_card_auth',
  WRITE_CARD_AUTH= 'write_card_auth',
  MODIFY_CARD_AUTH= 'modify_card_auth',
  DEACTIVATE_CARD_AUTH= 'deactivate_card_auth',
  ACTIVATE_CARD_AUTH= 'activate_card_auth',

  READ_VOUCHER = 'read_voucher',
  WRITE_VOUCHER = 'write_voucher',
  MODIFY_VOUCHER = 'modify_voucher',
  DEACTIVATE_VOUCHER = 'deactivate_voucher',
  ACTIVATE_VOUCHER = 'activate_voucher',

  READ_PROMOTION = 'read_promotion',
  WRITE_PROMOTION = 'write_promotion',
  MODIFY_PROMOTION = 'modify_promotion',
  DEACTIVATE_PROMOTION = 'deactivate_promotion',
  ACTIVATE_PROMOTION = 'activate_promotion',
  
  READ_CART = 'read_cart',
  WRITE_CART = 'write_cart',
  MODIFY_CART = 'modify_cart',
  DEACTIVATE_CART = 'deactivate_cart',
  ACTIVATE_CART = 'activate_cart',

  READ_STATE = 'read_state',
  WRITE_STATE = 'write_state',
  MODIFY_STATE = 'modify_state',
  DEACTIVATE_STATE = 'deactivate_state',
  ACTIVATE_STATE = 'activate_state',

  READ_LGA = 'read_lga',
  WRITE_LGA = 'write_lga',
  MODIFY_LGA = 'modify_lga',
  DEACTIVATE_LGA = 'deactivate_lga',
  ACTIVATE_LGA = 'activate_lga',

  READ_AUDIT = 'read_audit',
  WRITE_AUDIT = 'write_audit',
  MODIFY_AUDIT = 'modify_audit',
  DEACTIVATE_AUDIT = 'deactivate_audit',
  ACTIVATE_AUDIT = 'activate_audit',
  
  READ_WITHDRAWAL_REQUEST = 'read_withdrawal_request',
  WRITE_WITHDRAWAL_REQUEST = 'write_withdrawal_request',
  MODIFY_WITHDRAWAL_REQUEST = 'modify_withdrawal_request',
  DEACTIVATE_WITHDRAWAL_REQUEST = 'deactivate_withdrawal_request',
  ACTIVATE_WITHDRAWAL_REQUEST = 'activate_withdrawal_request',

}