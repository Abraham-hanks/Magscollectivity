import { TxtnModel } from "./models/txtn.model";
import { FUND_REQUEST_REPOSITORY, TXTN_REPOSITORY, WITHDRAWAL_REQUEST_REPOSITORY } from "./constants";
import { FundRequestModel } from "./models/fund-request.model";
import { WithdrawalRequestModel } from "./models/withdrawal-request.model";

export const TxtnProvider = [
  {
    provide: TXTN_REPOSITORY,
    useValue: TxtnModel,
  },
  {
    provide: FUND_REQUEST_REPOSITORY,
    useValue: FundRequestModel,
  },
  {
    provide: WITHDRAWAL_REQUEST_REPOSITORY,
    useValue: WithdrawalRequestModel,
  },
];
