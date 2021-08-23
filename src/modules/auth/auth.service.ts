import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateCustomerDto, CreateRealtorDto } from '../customer/dto/customer/create-customer.dto';
import { AuthModel as Auth } from './auth.model'
import { AuthObj, AUTH_REPOSITORY, EMAIL_VERIFICATION_LINK_PREFIX, EMAIL_VERIFICATION_LINK_PREFIX_DEV, FORGOT_PASSWORD_LINK_PREFIX } from './constants';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { CustomerService } from '../customer/services/customer.service';
import { RoleService } from '../role/role.service';
import { RoleModel } from '../role/models/role.model';
import { CustomerModel } from '../customer/models/customer.model';
import { ROLE_NAMES } from '../role/constants';
import { AdminModel } from '../admin/admin.model';
import { CreateAdminDto } from '../admin/dto/admin.dto';
import { AdminService } from '../admin/admin.service';
import { ADMIN_TYPES } from '../admin/constants';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { EmailHelper } from '../utility/services/email/email.helper';
import { NO_XTERS_EMAIL_TOKEN, TokenTypes, ValidateToken } from '../utility/constants';
import { TokenService } from '../utility/services/token.service';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { genRandomXters, isEmail } from 'src/common/utils/util';
import { configService } from 'src/common/config/config.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { RealtorTreeService } from '../customer/services/realtor-tree.service';


@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly customerService: CustomerService,
    private readonly adminService: AdminService,
    private readonly emailHelper: EmailHelper,
    private readonly realtorTreeService: RealtorTreeService,
    private readonly roleService: RoleService,
    private readonly tokenService: TokenService,
    @Inject(AUTH_REPOSITORY) private readonly authRepo: typeof Auth,
  ) { }

  async signUp(newUser: CreateCustomerDto | CreateRealtorDto) {
    let createdAuth: Auth, createdUser: CustomerModel;
    const resToken: any = {};

    // check if user exists
    const existingUser = await this.findByUsername(newUser.email, newUser.phone);
    if (existingUser)
      throw new BadRequestException(ERROR_MESSAGES.UserAlreadyExists);
    
    // check referral
    if (newUser.referral_code) {
      const referrer = await this.customerService.findOne({
        phone: newUser.referral_code,
        // is_realtor: true
      }, false);

      if (!referrer)
        throw new BadRequestException(ERROR_MESSAGES.ReferrerNotFound);

      newUser.referred_by_id = referrer.id;
      newUser.referral_code = null;
    }

    newUser.email = newUser.email.toLowerCase();
    newUser.hash = await bcrypt.hash(newUser.password, 10);
    newUser.role_id = (await this.roleService.findByName(newUser.role_name)).id;

    await this.authRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      // create auth
      createdAuth = await this.authRepo.create(newUser, transactionHost);

      // create customer
      newUser.auth_id = createdAuth.id;
      createdUser = await this.customerService.create(newUser, transactionHost);

      // process realtorTree tree
      await this.realtorTreeService.addReferrer(createdUser, transactionHost);

      // update auth with user_id
      createdAuth.user_id = createdUser.id;
      await createdAuth.save(transactionHost);


      // send verification email
      const createdToken = await this.tokenService.create({
        auth_id: createdAuth.id,
        value: genRandomXters(NO_XTERS_EMAIL_TOKEN),
        no_of_xters: NO_XTERS_EMAIL_TOKEN,
        type: TokenTypes.email_verification,
        valid_for: 10 * 1000
      }, transactionHost);

      const verificationUrlDev = `${EMAIL_VERIFICATION_LINK_PREFIX_DEV}/${createdToken.auth_id}/${createdToken.value}`;

      const verificationUrl = newUser.callback_url ? `${newUser.callback_url}?token=${createdToken.value}&id=${createdToken.auth_id}`
        : `${EMAIL_VERIFICATION_LINK_PREFIX}?token=${createdToken.value}&id=${createdToken.auth_id}`;

      resToken['token'] = createdToken.value;
      resToken['id'] = createdToken.auth_id;

      if (configService.isDev)
        console.log('verification_url: ' + verificationUrlDev);

      // send emails
      // this.emailHelper.welcome(createdAuth);
      this.emailHelper.emailVerifcation(createdAuth, verificationUrl);
    });

    if (configService.isStaging || configService.isDev)
      return {
        resToken,
        message: 'Customer Registered Successfully, Please check your email and click the verify link to proceed.'
      };

    return 'Customer Registered Successfully, Please check your email and click the verify link to proceed.';
  }


  async createAdmin(newAdmin: CreateAdminDto): Promise<AdminModel> {
    let createdAdmin: AdminModel, createdAuth: Auth;

    // check if user exists
    const existingUser = await this.findByUsername(newAdmin.email);
    if (existingUser)
      throw new BadRequestException(ERROR_MESSAGES.UserAlreadyExists);

    // if super_admin
    if (newAdmin.type == ADMIN_TYPES.super_admin) {

      const existingSuperAdmin = await this.findOne({
        role_name: ROLE_NAMES.super_admin
      });
      if (existingSuperAdmin)
        throw new BadRequestException(ERROR_MESSAGES.SuperAdminAlreadyExists);

      newAdmin.role_name = ROLE_NAMES.super_admin;
      newAdmin.role_id = (await this.roleService.findByName(ROLE_NAMES.super_admin)).id;
    }
    else {
      if (!newAdmin.role_id)
        throw new BadRequestException(ERROR_MESSAGES.AdminRoleNotSelected);

      newAdmin.role_name = (await this.roleService.findById(newAdmin.role_id)).name;

      if (newAdmin.role_name === ROLE_NAMES.super_admin) {
        throw new BadRequestException(ERROR_MESSAGES.SuperAdminAlreadyExists);
      }
    }

    newAdmin.hash = await bcrypt.hash(newAdmin.password, 10);

    await this.authRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      // create auth
      createdAuth = await this.authRepo.create(newAdmin, transactionHost);

      // create admin
      newAdmin.auth_id = createdAuth.id;
      createdAdmin = await this.adminService.create(newAdmin, transactionHost);

      // update auth
      createdAuth.user_id = createdAdmin.id;
      await createdAuth.save(transactionHost);
    });

    return createdAdmin;
  }


  async validateUser(username: string, password: string): Promise<AuthObj | any> {
    try {
      const auth = await this.findByUsername(username);

      // console.log('auth: ' + JSON.stringify(auth));

      if (!auth)  // unauthorized
        return null;

      if (auth.customer && !auth.customer.email_verified)
        return ERROR_MESSAGES.UserEmailNotVerified;

      if (!auth.is_active)
        return ERROR_MESSAGES.UserAccountIsInactive;

      if (await bcrypt.compare(password, auth.hash)) {

        const authObj: AuthObj = {
          auth_id: auth.id,
          role_name: auth.role.name
        };

        if (auth.customer && auth.customer.id)
          authObj.user_id = auth.customer.id;

        else if (auth.admin && auth.admin.id)
          authObj.user_id = auth.admin.id;

        return authObj;
      }
      return null;
    }
    catch (e) {
      return null;
    }
  }


  async login(authObj: AuthObj) {
    const auth = await this.findById(authObj.auth_id);
    auth.login_count = auth.login_count + 1;
    auth.last_login_at = new Date();
    await auth.save();
    
    return {
      auth: {...authObj},
      access_token: await this.generateJwtToken(authObj),
    };
  }


  async acDeactivateUser(user_id: number, role_name: ROLE_NAMES, activate: boolean): Promise<Auth> {
    const authUser = await this.findOne({
      user_id,
      role_name
    });

    if (!authUser)
      throw new BadRequestException(ERROR_MESSAGES.UserNotFound);

    if (activate && authUser.is_active)
      throw new BadRequestException(ERROR_MESSAGES.UserAlreadyActive);

    if (!activate && !authUser.is_active)
      throw new BadRequestException(ERROR_MESSAGES.UserAlreadyDeactivated);

    authUser.is_active = activate;
    return authUser.save();
  }


  async findById(id: number): Promise<Auth> {

    const auth = await this.authRepo.findByPk(id,
      {
        attributes: { exclude: ['deleted_at', 'hash'] },
        include: [
          {
            model: CustomerModel,
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
          },
        ],
      });

    if (!auth)
      throw new BadRequestException(ERROR_MESSAGES.UserNotFound);

    return auth;
  }

  async findOne(params): Promise<Auth> {
    const auth = await this.authRepo.findOne(
      {
        where: { ...params },
        attributes: { exclude: ['deleted_at', 'hash'] },
        include: [
          {
            model: CustomerModel,
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
          },
        ],
      });

    return auth;
  }

  // method overloading is used here
  async findByUsername(username: string): Promise<Auth>
  async findByUsername(email: string, phone: string): Promise<Auth>
  async findByUsername(emailOrUsername: string, phone?: string): Promise<Auth> {
   
    if (!phone)
      phone = emailOrUsername;
    
    if (isEmail(emailOrUsername)) 
      emailOrUsername = emailOrUsername.toLowerCase();

    const auth = await this.authRepo.findOne({
      where: {
        [Op.or]: [
          {
            email: {
              [Op.eq]: emailOrUsername
            }
          },
          {
            phone: {
              [Op.eq]: phone
            }
          },
        ]
      },
      include: [
        {
          model: RoleModel,
          attributes: {
            include: ['id', 'scopes']
          },
        },
        {
          model: CustomerModel,
          attributes: {
            include: ['id', 'email_verified', 'is_realtor']
          },
        },
        {
          model: AdminModel,
          attributes: {
            include: ['id']
          },
        },
      ],
      attributes: { exclude: ['deleted_at'] },
    });

    return auth;
  }


  // email verification
  async verifyEmailToken(tokenObj: ValidateToken): Promise<any> {

    let auth: Auth;
    await this.authRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      const customer = await this.customerService.findOne({
        auth_id: tokenObj.auth_id
      });

      if (customer.email_verified)
        throw new BadRequestException(ERROR_MESSAGES.CustomerEmailAlreadyVerified);

      await this.tokenService.validateToken(tokenObj, transactionHost);

      // update customer email_verified field
      customer.email_verified = true;
      await customer.save(transactionHost);

      // update auth is_active field
      auth = await this.findById(tokenObj.auth_id);
      auth.is_active = true;
      auth.login_count = auth.login_count + 1;
      auth.last_login_at = new Date();

      await auth.save(transactionHost);
    });

    // log verified user in
    const authObj: AuthObj = {
      auth_id: auth.id,
      user_id: auth.customer.id,
      role_name: auth.role_name
    };

    return {
      auth: {...authObj},
      access_token: await this.generateJwtToken(authObj)
    }
  }

  async resendEmailVerificationLink(username: string): Promise<any> {

    const auth = await this.findByUsername(username);

    if (!auth)
      throw new BadRequestException(ERROR_MESSAGES.InvalidUsername);

    if (!auth.customer)
      throw new BadRequestException(ERROR_MESSAGES.InvalidUsername);

    if (auth.customer.email_verified)
      return ERROR_MESSAGES.CustomerEmailAlreadyVerified;

    const token = await this.tokenService.regenerate({
      auth_id: auth.id,
      type: TokenTypes.email_verification
    });

    const verificationUrlDev = `${EMAIL_VERIFICATION_LINK_PREFIX_DEV}/${token.auth_id}/${token.value}`;

    const verificationUrl = `${EMAIL_VERIFICATION_LINK_PREFIX}?token=${token.value}&id=${token.auth_id}`;

    const resToken: any = {
      token: token.value,
      id: token.auth_id
    }

    if (configService.isStaging || configService.isDev) {
      console.log('verification_url: ' + verificationUrlDev);

      this.emailHelper.emailVerifcation(auth, verificationUrl);

      return {
        resToken,
        message: 'Email Sent! Please check your email and click the verify link to proceed.'
      }
    }
    else {

      this.emailHelper.emailVerifcation(auth, verificationUrl);

      return 'Email Sent! Please check your email and click the verify link to proceed.';
    }
  }

  //forgot and  reset password
  async sendForgotPasswordLink(forgotPasswordRequest: ForgotPasswordDto): Promise<string | any> {

    const auth = await this.findByUsername(forgotPasswordRequest.username);
    const resToken: any = {};

    if (!auth)
      return 'An email has been sent with further instructions.';

    await this.authRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      const createdToken = await this.tokenService.create({
        auth_id: auth.id,
        value: genRandomXters(NO_XTERS_EMAIL_TOKEN),
        no_of_xters: NO_XTERS_EMAIL_TOKEN,
        type: TokenTypes.forgot_password,
        valid_for: 10 * 1000
      }, transactionHost);

      // deactivate user's account
      auth.is_active = false;
      await auth.save(transactionHost);

      const callbackUrl = forgotPasswordRequest.callback_url ? `${forgotPasswordRequest.callback_url}?token=${createdToken.value}&id=${createdToken.auth_id}`
        : `${FORGOT_PASSWORD_LINK_PREFIX}?token=${createdToken.value}&id=${createdToken.auth_id}`;

      resToken['token'] = createdToken.value;
      resToken['id'] = createdToken.auth_id;

      // send emails
      this.emailHelper.forgotPassword(auth, callbackUrl);
    });

    if (configService.isStaging || configService.isDev) {

      return {
        resToken,
        message: 'Email Sent! Please check your email and click the verify link to proceed.'
      }
    }
    return 'An email has been sent with further instructions.';
  }

  async resetPassword(newPasswordReset: ResetPasswordDto): Promise<string> {
    const auth = await this.authRepo.findOne({
      where: {
        id: newPasswordReset.id
      }
    });

    if (!auth)
      throw new BadRequestException(ERROR_MESSAGES.UserNotFound)

    await this.authRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      await this.tokenService.validateToken({
        auth_id: newPasswordReset.id,
        value: newPasswordReset.token,
        type: TokenTypes.forgot_password
      }, transactionHost);

      auth.hash = await bcrypt.hash(newPasswordReset.password, 10);

      // activate user's acc
      auth.is_active = true;

      await auth.save(transactionHost);
    });

    return `Password reset successful`;
  }

  async logout(id: number) {
    await this.tokenService.findAuthTokensAndDelete(id);
  
    return 'Logout successful'
  }

  // others
  async generateJwtToken(authObj: AuthObj) {
    // add auth token for blacklisting here
    // const auth_token = await this.utilService.generateAuthToken(user.id);

    await this.authRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      const createdToken = await this.tokenService.create({
        auth_id: authObj.auth_id,
        value: genRandomXters(NO_XTERS_EMAIL_TOKEN),
        no_of_xters: NO_XTERS_EMAIL_TOKEN,
        type: TokenTypes.auth,
        valid_for: 10 * 1000
      }, transactionHost);

      authObj.authToken = createdToken.value;
    })

    return this.jwtService.sign(authObj);
  }

  async validateJwtToken(value: string, auth_id: number) {

    if (await this.tokenService.findOne({ value, auth_id, type: TokenTypes.auth }, false))
      return true;

    return false;
  }

  async getRoleScopes(roleName: ROLE_NAMES | string): Promise<string[]> {
    return (await this.roleService.findByName(roleName)).scopes;
  }
}
