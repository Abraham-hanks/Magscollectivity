import { IsBoolean, IsDate, IsEnum, IsOptional, IsPositive } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { PAYMENT_TYPE, REQUEST_STATUS, REQUEST_TYPE } from '../constants';

export class ChangeRequestQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  @IsPositive()
  customer_id?: number;

  @IsOptional()
  @IsPositive()
  product_id?: number;

  @IsOptional()
  @IsEnum(REQUEST_TYPE)
  request_type?: REQUEST_TYPE;

  @IsOptional()
  @IsEnum(PAYMENT_TYPE)
  payment_type?: PAYMENT_TYPE;

  @IsOptional()
  @IsBoolean()
  request_status?: REQUEST_STATUS;

  @IsOptional()
  @IsDate()
  approval_date?: Date;
}

export const ChangeRequestQueryFiltersArray = [
  'customer_id', 
  'product_id', 
  'request_type',
  'approved',
  'approval_date',
];