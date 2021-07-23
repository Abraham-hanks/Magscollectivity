import { ApiHideProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { PRODUCT_STATUS } from '../../constants';
import { CreateProductDto } from './create-product.dto';


export class UpdateProductDto extends PartialType(
  PickType(CreateProductDto,
    [
      'name',
      'address',
      'can_cancel_subscription',
      'can_pause_subscription',
      'coordinates',
      'description',
      'features',
      'images',
      'size_per_unit',
      'status',
      'property_type'
    ] as const),
) {
  @IsOptional()
  @ApiHideProperty()
  updated_by_id?: number;
 }