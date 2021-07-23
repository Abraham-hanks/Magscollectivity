import { IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class WalletQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  customer_id?: number;
}
