import { AUDIT_REPOSITORY, BANK_REPOSITORY, LGA_REPOSITORY, STATE_REPOSITORY, TOKEN_REPOSITORY } from "./constants";
import { AuditModel } from "./models/audit.model";
import { LgaModel } from "./models/lga.model";
import { StateModel } from "./models/state.model";
import { TokenModel } from "./models/token.model";

export const UtilityProvider = [
    {
      provide: AUDIT_REPOSITORY,
      useValue: AuditModel,
    },
    {
      provide: LGA_REPOSITORY,
      useValue: LgaModel,
    },
    {
      provide: STATE_REPOSITORY,
      useValue: StateModel,
    },
    {
      provide: TOKEN_REPOSITORY,
      useValue: TokenModel,
    },
  ];