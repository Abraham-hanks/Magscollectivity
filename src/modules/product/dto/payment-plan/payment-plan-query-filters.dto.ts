import { IsNumberString, IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class PaymentPlanQueryFiltersDto extends BaseQueryFiltersDto {

  @IsNumberString()
  product_id: number;

  @IsOptional()
  is_active: boolean;
}
