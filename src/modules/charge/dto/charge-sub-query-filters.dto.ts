import { IsBoolean, IsDate, IsEnum, IsOptional, IsPositive } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { CHARGE_SUBSCRIPTION_STATUS } from '../constants';

export class ChargeSubQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  @IsPositive()
  customer_id?: number;

  @IsOptional()
  @IsPositive()
  duration?: number;

  @IsOptional()
  @IsDate()
  start_date?: Date;

  @IsOptional()
  @IsDate()
  end_date?: Date;

  @IsOptional()
  @IsDate()
  next_deduction_date?: Date;

  @IsOptional()
  @IsEnum(CHARGE_SUBSCRIPTION_STATUS)
  status?: CHARGE_SUBSCRIPTION_STATUS;
}

export class ChargeSubStatusDto {
  
  @IsEnum(CHARGE_SUBSCRIPTION_STATUS)
  status: CHARGE_SUBSCRIPTION_STATUS;
}

export const ChargeSubQueryFiltersArray = [
  'customer_id',
  'duration',
  'start_date',
  'end_date',
  'next_deduction_date',
  'status',
];
