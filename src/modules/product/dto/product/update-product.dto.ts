import { ApiHideProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(
  PickType(CreateProductDto,
    [
      'name',
      'address',
      'state_id',
      'lga_id',
      'state_name',
      'lga_name',
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
