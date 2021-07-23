import { RoleModel } from "./models/role.model";
import { ROLE_REPOSITORY, SCOPE_REPOSITORY } from "./constants";
import { ScopeModel } from "./models/scope.model";

export const RoleProvider = [
  {
    provide: ROLE_REPOSITORY,
    useValue: RoleModel,
  },
  {
    provide: SCOPE_REPOSITORY,
    useValue: ScopeModel,
  },
];
