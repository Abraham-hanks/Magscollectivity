import { Body, Controller, Post, UseGuards, Request, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { SCOPES } from 'src/common/auth/scopes';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { ADMIN_TYPES } from '../admin/constants';
import { CreateAdminDto } from '../admin/dto/admin.dto';
import { CreateCustomerDto, CreateRealtorDto } from '../customer/dto/customer/create-customer.dto';
import { ValidateReferralCodeDto } from '../customer/dto/customer/customer-query-filters.dto';
import { CustomerService } from '../customer/services/customer.service';
import { ROLE_NAMES } from '../role/constants';
import { TokenTypes } from '../utility/constants';
import { AuthService } from './auth.service';
import { Role } from './decorator/role.decorator';
import { GetUser } from './decorator/user.decorator';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RoleGuard } from './guards/role.guard';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(AuditInterceptor, TransformInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() login: LoginDto, // for swagger docs
    @Request() req) {
    return this.authService.login(req.user);
  }

  @Post('customer-sign-up')
  async customerSignUp(@Body() newCustomer: CreateCustomerDto) {
    newCustomer.role_name = ROLE_NAMES.customer;

    return this.authService.signUp(newCustomer);
  }

  @Post('realtor-sign-up')
  async realtorSignUp(@Body() newRealtor: CreateRealtorDto) {
    newRealtor.role_name = ROLE_NAMES.realtor;
    newRealtor.is_realtor = true;

    return this.authService.signUp(newRealtor);
  }

  @Post('admin')
  @Role(SCOPES.WRITE_ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createAdmin(@Body() newAdmin: CreateAdminDto) {

    return this.authService.createAdmin(newAdmin);
  }

  @ApiExcludeEndpoint()
  @Post('admin/first')
  @UseGuards()
  async createFirstAdmin(@Body() newAdmin: CreateAdminDto) {
    newAdmin.type = ADMIN_TYPES.super_admin;

    return this.authService.createAdmin(newAdmin);
  }

  @Get('validate-referral-code')
  async validateReferralCode(
    @Query() query: ValidateReferralCodeDto,
  ) {

    return this.customerService.validateReferralCode(query.referral_code);
  }

  // email verification
  @Get('verify-email/:auth_id/:value')
  async verifyEmailToken(
    @Param('auth_id', ParseIntPipe) auth_id: number,
    @Param('value') value: string,
  ) {

    return this.authService.verifyEmailToken({
      auth_id,
      value,
      type: TokenTypes.email_verification
    });
  }

  @Post('resend-email-verification-link/:username')
  async resendEmailVerificationLink(
    @Param('username') username: string,
  ) {
    
    return this.authService.resendEmailVerificationLink(username);
  }

  @Post('forgot-password')
  async sendForgotPasswordLink(
    @Body() payload: ForgotPasswordDto,
  ) {
    return this.authService.sendForgotPasswordLink(payload);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() payload: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@GetUser("auth_id") id:number) {
    return this.authService.logout(id);
  }
}
