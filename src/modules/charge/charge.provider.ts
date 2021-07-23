import { ChargeModel } from "./models/charge.model";
import { CHARGE_REPOSITORY, CHARGE_SUBSCRIPTION_REPOSITORY } from "./constants";
import { ChargeSubscriptionModel } from "./models/charge-subscription.model";

export const ChargeProvider = [
  {
    provide: CHARGE_SUBSCRIPTION_REPOSITORY,
    useValue: ChargeSubscriptionModel,
  },
  {
    provide: CHARGE_REPOSITORY,
    useValue: ChargeModel,
  },
]
