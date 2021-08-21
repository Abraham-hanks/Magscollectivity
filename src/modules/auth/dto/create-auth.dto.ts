import { ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsUrl, Matches, MinLength } from 'class-validator';
import { TWO_FA_TYPES } from '../constants';

export class CreateAuthDto {
  @MinLength(2)
  firstname: string;

  @MinLength(2)
  lastname: string;

  @MinLength(2)
  @IsOptional()
  middlename?: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('NG')
  phone: string;

  @IsOptional()
  @MinLength(6)
  @ApiHideProperty()
  hash?: string;

  @MinLength(7)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{7,64}$/gm, {
    message:
      'Password must be between 7 and 64 characters long with at least 1 special character, number and capital letter',
  })
  password: string;

  @ApiHideProperty()
  @IsOptional()
  role_id?: number;

  @ApiHideProperty()
  role_name?: string;
  // role_name?: ROLE_NAMES;

  @IsOptional()
  two_fa_enabled? = false;

  @IsOptional()
  two_fa_type?: TWO_FA_TYPES;

  @IsOptional()
  @IsUrl()
  callback_url: string;
}
