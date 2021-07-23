import { ADMIN_REPOSITORY } from "./constants";
import { AdminModel } from "./admin.model";

export const AdminProvider = [
  {
    provide: ADMIN_REPOSITORY,
    useValue: AdminModel,
  }
];
