import { IsBooleanString, IsEmail, IsEnum, IsNumberString, IsOptional, IsPhoneNumber } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { ENUM_GENDER } from '../../constants';

export class CustomerQueryFiltersDto extends BaseQueryFiltersDto {

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(ENUM_GENDER)
  gender?: ENUM_GENDER;

  @IsOptional()
  state_id?: number;

  @IsOptional()
  lga_id?: number;
  
  @IsOptional()
  is_realtor?: boolean;

  @IsOptional()
  realtor_stage?: number;

  @IsOptional()
  current_network_length?: number;

  @IsOptional()
  @IsBooleanString()
  is_active?: boolean;
}

export const CustomerQueryFiltersArr = [
  'phone', 'email', 'state_id', 'lga_id',
  'is_realtor', 'realtor_stage',
  'current_network_length', 'is_active'
];

export class RealtorDownlineQueryFiltersDto extends BaseQueryFiltersDto {

  @IsOptional()
  @IsNumberString()
  realtor_id?: number
}

export class ValidateReferralCodeDto{
  @IsPhoneNumber('NG')
  referral_code: string
}
