import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_MESSAGES } from '../utils/error-messages';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // const roles = this.reflector.getAllAndOverride<string[]>('roles', [
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // role not provided, i.e auth not required for endpoint
    if (!roles || roles.length == 0)
      return true;

    const request = context.switchToHttp().getRequest();
    const { userId, userRole } = request.user;

    if (!userRole)
      throw new UnauthorizedException(ERROR_MESSAGES.UserRoleNotSupplied);
    if (!userId)
      throw new UnauthorizedException(ERROR_MESSAGES.UserIdNotSupplied);

    // compare roles with role in params
    if (!this.matchRoles(roles, userRole))
      throw new UnauthorizedException(ERROR_MESSAGES.Unauthorized);

    return true;
  }


  private matchRoles(roles: string[], userRole): boolean  {
    return roles.includes(userRole);
  }
}
