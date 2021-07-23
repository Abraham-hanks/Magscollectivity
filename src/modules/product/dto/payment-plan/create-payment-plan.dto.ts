import { ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { isNotNullOnValue } from 'src/common/decorator/validator/is-not-null-on-value.decorator';
import { PAYMENT_PLAN_TYPE } from '../../constants';


export class CreatePaymentPlanDto {

  @IsPositive()
  product_id: number;

  @IsPositive()
  @IsOptional()
  minimun_no_units?: number;

  @IsPositive()
  duration: number;

  @IsOptional()
  @IsPositive()
  minimun_deposit_amount?: number; //add for swagger docs

  // @Min(1)
  // @Max(3)
  // interval? = 1;

  @Min(1000 * 100)
  amount_per_unit: number;


  @IsEnum(PAYMENT_PLAN_TYPE)
  type: PAYMENT_PLAN_TYPE;

  @ApiHideProperty()
  is_active = true;

  @IsOptional()
  @ApiHideProperty()
  created_by_id?: number;
}
