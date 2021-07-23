import { ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';
import { CreateAuthDto } from 'src/modules/auth/dto/create-auth.dto';
import { ENUM_GENDER, MARITAL_STATUS, REALTOR_STAGE } from '../../constants';

// export class CreateCustomerDto extends BaseDto {
export class CreateCustomerDto extends CreateAuthDto {

  @IsOptional()
  @ApiHideProperty()
  auth_id?: number;

  // @IsDate()
  @IsOptional()
  dob?: Date;

  @IsOptional()
  gender?: ENUM_GENDER;

  @IsOptional()
  profile_pic?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  occupation?: string;

  @IsOptional()
  marital_status?: MARITAL_STATUS;

  @IsOptional()
  state_id?: number;

  @IsOptional()
  lga_id?: number;

  @ApiHideProperty()
  @IsOptional()
  state_name?: string;

  @ApiHideProperty()
  @IsOptional()
  lga_name?: string;

  @IsOptional()
  country?: string;

  @ApiHideProperty()
  email_verified = false;

  @ApiHideProperty()
  @IsOptional()
  referred_by_id?: number; // db id of referrer

  @IsOptional()
  @IsPhoneNumber('NG')
  referral_code?: string; // referral code of referrer

  @IsOptional()
  @ApiHideProperty()
  wallet_id?: number;

  @ApiHideProperty()
  bvn_verified = false;

  // @IsOptional()
  @ApiHideProperty()
  is_active = false;

  @ApiHideProperty()
  @IsOptional()
  is_realtor = false;

  // next of kind fields

  @IsOptional()
  @MinLength(2)
  next_of_kin_full_name?: string;

  @IsOptional()
  @IsPhoneNumber('NG')
  next_of_kin_phone?: string;

  @IsOptional()
  next_of_relationship?: string;

  @MinLength(5)
  @IsOptional()
  next_of_kin_address?: string;
}

export class CreateRealtorDto extends CreateCustomerDto {

  @ApiHideProperty()
  @IsOptional()
  is_realtor_approved: boolean;

  @ApiHideProperty()
  @IsOptional()
  realtor_stage = REALTOR_STAGE.inactive_ambassador // goes to ambassador after 1st direct sale

  // @IsOptional()
  // max_network_levels: number // TODO

  @ApiHideProperty()
  @IsOptional()
  current_network_length: number

  @IsOptional()
  @ApiHideProperty()
  referral_code?: string;
}
