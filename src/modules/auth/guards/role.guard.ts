import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { AuthObj } from '../constants';


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const scope = this.reflector.get<string>('scope', context.getHandler());

    // scope not provided, i.e auth not required for endpoint
    if (!scope)
      return true;

    const user: AuthObj  = context.switchToHttp().getRequest().user;

    // console.log('scope: ' + scope);
    // console.log('user: ' + JSON.stringify(user.scopes));

    if (!(user && user.scopes))
      throw new UnauthorizedException(ERROR_MESSAGES.Unauthorized);

    const userScopes: string[] = user.scopes;


    if (userScopes.includes(scope))
      return true;

    throw new UnauthorizedException(ERROR_MESSAGES.Unauthorized);
  }
}
