import { ApiHideProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreatePaymentPlanDto } from '../payment-plan/create-payment-plan.dto';


export class UpdatePaymentPlanDto extends PartialType(
  PickType(CreatePaymentPlanDto,
    [
      // 'duration',
      // 'am',
      // 'amount_per_installment',
      'is_active'
    ] as const),
) {
  @IsOptional()
  @ApiHideProperty()
  updated_by_id?: number;
}