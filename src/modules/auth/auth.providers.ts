import { AUTH_REPOSITORY } from "./constants";
import { AuthModel } from "./auth.model";

export const AuthProvider = [
  {
    provide: AUTH_REPOSITORY,
    useValue: AuthModel,
  }
];
