import { ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsUrl, MinLength } from 'class-validator';
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

  @MinLength(6)
  password: string;

  @ApiHideProperty()
  @IsOptional()
  role_id?: number;

  @ApiHideProperty()
  role_name?: string;
  // role_name?: ROLE_NAMES;

  @IsOptional()
  two_fa_enabled = false;

  @IsOptional()
  two_fa_type?: TWO_FA_TYPES;

  @IsOptional()
  @IsUrl()
  callback_url: string;
}