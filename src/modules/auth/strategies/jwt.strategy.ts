import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configService } from 'src/common/config/config.service';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { AuthService } from '../auth.service';
import { AuthObj } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret(),
    });
  }

  async validate(payload: AuthObj) {
    
    // add role scopes to payload to be used by role guard
    payload.scopes = await this.authService.getRoleScopes(payload.role_name);

    //validate token in DB
    if (!await this.authService.validateJwtToken(payload.authToken, payload.auth_id))
      throw new UnauthorizedException(ERROR_MESSAGES.UserLoggedOut);
    

    return payload;
  }
}
