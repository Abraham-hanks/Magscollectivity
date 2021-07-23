import { WalletModel } from "./wallet.model";
import { WALLET_REPOSITORY } from "./constants";

export const WalletProvider = [
  {
    provide: WALLET_REPOSITORY,
    useValue: WalletModel,
  },
];
