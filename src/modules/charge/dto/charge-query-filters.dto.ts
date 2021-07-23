import { ApiHideProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsPositive } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { CHARGE_STATUS, CHARGE_SUBSCRIPTION_STATUS, CHARGE_TYPE } from '../constants';

export class ChargeQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  @IsPositive()
  product_id?: number;

  @IsOptional()
  @IsPositive()
  customer_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(CHARGE_TYPE)
  type?: CHARGE_TYPE;

  @ApiHideProperty()
  @IsOptional()
  status?: CHARGE_STATUS;
}

export class ChargeSubStatusDto {
  @IsEnum(CHARGE_SUBSCRIPTION_STATUS)
  status: CHARGE_SUBSCRIPTION_STATUS;
}

export const ChargeQueryFiltersArray = [
  'product_id',
  'customer_id',
  'is_active',
  'type',
  'status'
];
