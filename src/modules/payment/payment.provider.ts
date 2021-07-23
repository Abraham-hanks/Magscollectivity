import { CARD_AUTH_REPOSITORY, BANK_ACCOUNT_REPOSITORY } from "./constants";
import { BankAccountModel } from "./models/bank-account.model";
import { CardAuthModel } from "./models/card-auth.model";

export const PaymentProvider = [
  {
    provide: CARD_AUTH_REPOSITORY,
    useValue: CardAuthModel,
  },
  {
    provide: BANK_ACCOUNT_REPOSITORY,
    useValue: BankAccountModel,
  },
];
