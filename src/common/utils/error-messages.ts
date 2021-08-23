export enum ERROR_MESSAGES {
  
  // audit
  AuditNotFound = "Audit not found",

  // auth
  Unauthorized = 'Insufficient permission for this request',
  Unauthenticated = 'Invalid username and or password',
  InvalidUsername = 'Invalid username',
  UserLoggedOut = 'Unauthorized',

  // admin
  AdminNotFound = 'Admin Not Found',
  AdminAlreadyExists = 'Admin Already Exists',
  SuperAdminAlreadyExists = 'Super admin Already Exists',
  AdminRoleNotSelected = 'Admin Role Not Selected',

  // bank account
  BankAccountNotFound = 'Bank account not found',
  BankAccountAlreadyActive = 'Bank account already active',
  BankAccountAlreadyAdded = 'Bank account already added',
  InvalidBankAccountDetails = 'Invalid Bank account details',
  BankAccountAlreadyDeactivated = 'Bank account already deactivated',

  // card
  CardAuthNotFound = 'Card Authorization not found',
  CardAuthAlreadyActive = 'Card Authorization already active',
  CardAuthAlreadyDeactivated = 'Card Authorization already deactivated',

  // change request
  ChangeRequestNotFound = 'Change Request not found',
  ChangeRequestAlreadyApproved = 'Change Request already approved',
  ChangeRequestAlreadyDisapproved = 'Change Request already disapproved',

  // charge
  ChargeNotFound = 'Charge Not Found',
  ChargeAlreadyActive = 'Charge already active',
  ChargeAlreadyDeactivated = 'Charge already deactivated',

  // charge subscription
  ChargeSubscriptionNotFound = 'Charge subscription not found',

  // fund request
  FundRequestNotFound = 'Fund Request not found',
  FundRequestAlreadyApproved = 'Fund Request already approved',
  FundRequestAlreadyDeclined = 'Fund Request already declined',
  PaymentAmountNotEqualToProductSubscriptionAmountLeft = 'Payment amount not equal to product subscription amount left',

  // commission
  InvalidPercentageValue = 'Invalid percentage value',
  InvalidAmountValue = 'Invalid amount value',

  // customer
  CustomerNotFound = 'Customer Not Found',
  CustomerAlreadyExists = 'Customer Already Exists',
  CustomerEmailAlreadyVerified = 'Customer Email already verified',
  ReferrerNotFound = "Referrer Not Found",

  // document
  DocumentNotFound = 'Document Not Found',
  DocumentAlreadyActive = 'Document already active',
  DocumentAlreadyDeactivated = 'Document already deactivated',

  // house plan
  HousePlanNotFound = 'House plan not found',
  HousePlanAlreadyActive = 'House plan already active',
  HousePlanAlreadyDeactivated = 'House plan already deactivated',

  // input
  InvalidDate = 'Invalid Date',
  WhereParameterNotIncluded = 'Where parameter not included in query',

  // product
  ProductNotFound = 'Product Not Found',
  ProductIsNotActive = 'Product is not active',

  // product subscription
  ProductSubIdNotSupplied = 'Product subscription id is required',
  ProductIdAndPaymentPlanMismactch = 'Product id and payment-plan id mismatch',
  ProductSubscriptionNotFound = 'Product Subscription Not Found',
  InsufficientProductUnits = 'Units available for this product: ',
  ProductAlreadyActive = 'Product already active',
  ProductAlreadyDeactivated = 'Product already deactivated',
  ProductSubAlreadyCompleted = 'Product Subscription already Completed',
  ProductSubCancelled = 'Product Subscription cancelled',
  ProductSubIdAndCustomerIdMismatch = 'Product Subscription id and customer id mismatch',
  PaymentPropertyForPropertMustBeCompleted = 'Payment property for propert must be completed',
  PaymentPlanRequiresMinimumUnitsOf = 'Payment Plan Requires Minimum Units of: ',
  PaymentPlanRequiresMinimumDepositAmountOf = 'Payment Plan Requires per unit Minimum Deposit Amount of: ',
  InitialPaymentAmtForOutrightPlanMustEqualTotalAmount = 'Initial payment amount for outright plan must equal total amount',

  // payment plan
  PaymentPlanNotFound = 'Payment plan not found',
  DuplicatePaymentPlan = 'Duplicate Payment plan',
  PaymentPlanAlreadyActive = 'Payment plan already active',
  PaymentPlanAlreadyDeactivated = 'Payment plan already deactivated',
  InvalidPaymentPlanCalculation = 'InvalidPaymentPlanCalculation',

  // paystack
  PaystackTxtnInitiateError = 'Error iniitiating a transaction on paystack',
  PaystackCreateReceipientError = 'Error creating a receipient on paystack',
  FundsTransferError = 'Paystack funds transfer error',
  PaystackBankVerificationError = 'Unable to verify bank account',

  //realtor
  RealtorIdMustBeSupplied = 'Realtor Id Must Be Supplied',

  //realtor_tree
  RealtorTreeNotFound = 'RealtorTree not found',
  RealtorTreeAlreadyActive = 'RealtorTree already active',
  RealtorTreeAlreadyDeactivated = 'RealtorTree already deactivated',
  RealtorTreePaymentNotFound = 'RealtorTree payment not found',
  RealtorTreePaymentAlreadyActive = 'RealtorTree payment already active',
  RealtorTreePaymentAlreadyDeactivated = 'RealtorTree payment already deactivated',

  // role
  RoleNotFound = 'Role not found',
  ScopeNotFound = 'Scope not found',

  // server
  InternalServerError = 'Internal Server Error',
  SequelizeDatabaseError = 'SequelizeDatabaseError',

  // token
  InvalidToken = 'Invalid Token',
  TokenNotFound = "Invalid Token",  // intentional, don't tell user token isn't found
  TokenAlreadyVerified = 'Token already verified',

  // transaction
  TxtnNotFound = 'Transaction not found',
  DuplicateTxtn = 'Duplicate Transaction',
  TransactionAlreadySuccessful = 'Transaction already successful',
  TransactionAlreadyFailed = 'Transaction already failed',
  TransactionAlreadyCompleted = 'Transaction already completed',
  InvalidCurrency = 'Invalid currency',
  InvalidTxtnAmount = 'Invalid transaction amount',

  // user
  UserRoleNotSupplied = 'User role not Supplied',
  UserIdNotSupplied = 'User id not Supplied',
  UserAlreadyActive = 'User already active',
  UserAlreadyDeactivated = 'User already deactivated',
  UserNotFound = 'User Not Found',
  UserEmailNotVerified = 'User email not verified',
  UserAccountIsInactive = 'User Account is inactive',
  UserAlreadyExists = 'User already exists',
  UserMustBeCustomerOrRealtor = 'User must be a customer or realtor',

  // utility
  BankNotFound = 'Bank Not Found',
  StateNotFound = 'State Not Found',
  LgaNotFound = 'Lga Not Found',

  // wallet
  WalletNotFound = 'Wallet not found',
  AdminWalletsNotFound = 'Admin Wallets not found',
  WalletNotActive = 'Wallet not active',
  InsufficientWalletBal = 'Insufficient Wallet Balance',
  WalletAlreadyActive = 'Wallet already active',
  WalletAlreadyDeactivated = 'Wallet already deactivated',

  // withdrawal request
  WithdrawalRequestNotFound = 'Withdrawal Request not Found',
  WithdrawalRequestAlreadyApproved = 'Withdrawal already approved',
  WithdrawalRequestAlreadyProcessed = 'Withdrawal already processed',
  WithdrawalRequestAlreadyDeclined = 'Withdrawal already declined',
}
