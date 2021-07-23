import { IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { PRODUCT_SUB_STATUS } from '../constants';

export class ProductSubQueryFiltersDto extends BaseQueryFiltersDto {

  @IsOptional()
  customer_id?: number;

  @IsOptional()
  product_id?: number;

  @IsOptional()
  status?: PRODUCT_SUB_STATUS;
}

export const ProductSubQueryFiltersArr = [
  'customer_id',
  'product_id',
  'status'
]
