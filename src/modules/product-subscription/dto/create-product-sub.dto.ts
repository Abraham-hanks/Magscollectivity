import { ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPositive, IsUrl, Min } from 'class-validator';
import { isDateAfter } from 'src/common/decorator/validator/is-date-after.decorator';
import { isTodayOrFutureDate } from 'src/common/decorator/validator/is-today-or-future-date.decorator';
import { PRODUCT_SUB_PAYMENT_METHOD, PRODUCT_SUB_STATUS } from '../constants';

export class CreateProductSubDto {
  
  @ApiHideProperty()
  @IsOptional()
  @IsPositive()
  customer_id?: number;

  @Min(1)
  units: number;

  @IsPositive()
  initial_payment_amount: number;

  @ApiHideProperty()
  @IsPositive()
  @IsOptional()
  total_amount?: number;

  @ApiHideProperty()
  @IsPositive()
  @IsOptional()
  actual_amount?: number;

  // payment plan details
  @ApiHideProperty()
  @IsPositive()
  @IsOptional()
  amount_per_unit?: number;

  @ApiHideProperty()
  @IsOptional()
  is_installment: boolean;

  @ApiHideProperty()
  @IsPositive()
  @IsOptional()
  duration?: number;

  // @IsDate()
  @ApiHideProperty()
  @IsOptional()
  @isTodayOrFutureDate()
  start_date?: Date;

  @ApiHideProperty()
  @IsOptional()
  @isDateAfter('start_date')
  end_date?: Date;

  @ApiHideProperty()
  @IsOptional()
  @isDateAfter('start_date')
  next_deduction_date?: Date;

  @IsPositive()
  product_id: number;

  @IsPositive()
  @IsOptional()
  promotion_id?: number;

  @IsPositive()
  payment_plan_id: number;

  @ApiHideProperty()
  @IsOptional()
  status = PRODUCT_SUB_STATUS.initiated;

  @IsUrl()
  @IsOptional()
  callback_url?: string;

  @IsEnum(PRODUCT_SUB_PAYMENT_METHOD)
  payment_method: PRODUCT_SUB_PAYMENT_METHOD;
}
