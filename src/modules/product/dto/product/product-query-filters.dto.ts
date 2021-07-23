import { IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { PRODUCT_STATUS, PROPERTY_TYPE } from '../../constants';

export class ProductQueryFiltersDto extends BaseQueryFiltersDto {

  @IsOptional()
  name?: string;

  @IsOptional()
  state_id?: number;

  @IsOptional()
  lga_id?: number;

  @IsOptional()
  status?: PRODUCT_STATUS;

  @IsOptional()
  property_type?: PROPERTY_TYPE;

  @IsOptional()
  is_active = true;
}

export const ProductQueryFiltersArr = [
  'name', 'description', 'state_id', 'lga_id', 'status', 'property_type', 'is_active'
];

//  this doesn't work because BaseQueryFiltersDto needs to be extended
// export class ProductQueryFiltersDto extends PartialType(
//   OmitType(CreateProductDto,
//     [
//       'name',
//       'house_plan_id',
//       'lga_id',
//       'state_id',
//       'subscription_status',
//       'status'
//     ] as const),
// ) { }