import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { configService } from 'src/common/config/config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthProvider } from './auth.providers';
import { CustomerModule } from '../customer/customer.module';
import { RoleModule } from '../role/role.module';
import { UtilityModule } from '../utility/utility.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: configService.getExpiresIn() },
    }),
    forwardRef(() => AdminModule), // to resolve circular dependency
    CustomerModule,
    RoleModule,
    UtilityModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ...AuthProvider],
  controllers: [AuthController],
  exports: [AuthService, UtilityModule]
})
export class AuthModule { }
