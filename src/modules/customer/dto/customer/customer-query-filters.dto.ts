import { IsEmail, IsNumberString, IsOptional, IsPhoneNumber } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { ENUM_GENDER } from '../../constants';

export class CustomerQueryFiltersDto extends BaseQueryFiltersDto {

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  gender?: ENUM_GENDER;

  @IsOptional()
  state_id?: number;

  @IsOptional()
  lga_id?: number;
  
  @IsOptional()
  is_realtor?: boolean;

  @IsOptional()
  is_realtor_approved?: boolean;

  @IsOptional()
  realtor_stage?: number;

  @IsOptional()
  current_network_length?: number;

}

export const CustomerQueryFiltersArr = [
  'phone', 'email', 'state_id', 'lga_id',
  'is_realtor', 'is_realtor_approved', 'realtor_stage',
  'current_network_length'
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
