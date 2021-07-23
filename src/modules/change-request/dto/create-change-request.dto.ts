import { ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { PAYMENT_TYPE, REQUEST_STATUS, REQUEST_TYPE } from '../constants';

export class CreateChangeRequestDto {
  @IsPositive()
  product_id: number;

  @ApiHideProperty()
  @IsOptional()
  customer_id: number;

  @IsEnum(REQUEST_TYPE)
  request_type: REQUEST_TYPE;

  @IsEnum(PAYMENT_TYPE)
  payment_type: PAYMENT_TYPE;

  @IsOptional()
  @IsString()
  description: string;

  @ApiHideProperty()
  @IsOptional()
  charge_id: number;

  @ApiHideProperty()
  @IsOptional()
  approved? = false;

  @ApiHideProperty()
  @IsOptional()
  approval_date: Date;

  @ApiHideProperty()
  @IsOptional()
  request_status: REQUEST_STATUS = REQUEST_STATUS.PENDING;
}
