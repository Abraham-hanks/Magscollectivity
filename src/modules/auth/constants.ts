import { configService } from "src/common/config/config.service";
import { ROLE_NAMES } from "../role/constants";

export enum TWO_FA_TYPES {
  otp = 'otp',
}

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';
export const EMAIL_VERIFICATION_LINK_PREFIX_DEV = `${configService.getAppUrl()}/auth/verify-email`;
export const FORGOT_PASSWORD_LINK_PREFIX = `${configService.getWebAppUrl()}/reset-password`;
export const EMAIL_VERIFICATION_LINK_PREFIX = `${configService.getWebAppUrl()}/verify`;
export const WEB_APP_LOGIN_LINK_PREFIX = `${configService.getWebAppUrl()}/login`;

export interface AuthObj {
  auth_id: number,
  user_id?: number,
  authToken?: string,
  role_name: ROLE_NAMES | string,
  scopes?: string[]
}

export const AuthAttributeIncludeFields = ['id', 'last_login_at', 'login_count', 'last_ip', 'last_device_type', 'two_fa_enabled'];
