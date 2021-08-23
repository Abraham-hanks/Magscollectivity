import { ApiHideProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { PRODUCT_STATUS, PROPERTY_TYPE } from '../../constants';

export class CreateProductDto {

  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  address?: string;

  // state_id & lga_id added for query-filters
  @IsOptional()
  @IsPositive()
  state_id?: number;

  @IsOptional()
  @IsPositive()
  lga_id?: number;

  @ApiHideProperty()
  @IsOptional()
  state_name?: string;

  @ApiHideProperty()
  @IsOptional()
  lga_name?: string;

  @Min(100)
  unit_price: number;

  @Min(1)
  total_units: number;

  @IsOptional()
  @ApiHideProperty()
  available_units?: number;

  @IsOptional()
  @IsBoolean()
  can_cancel_subscription? = false;

  @IsOptional()
  @IsBoolean()
  can_pause_subscription? = false;

  @Min(1)
  @IsOptional()
  size_per_unit?: number;

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsOptional()
  @IsArray()
  coordinates?: string[];

  @IsOptional()
  @IsBoolean()
  shd_pay_commission? = true;

  @IsOptional()
  @ApiHideProperty()
  locked_fields?= ['unit_price'];

  @IsOptional()
  @ApiHideProperty()
  status?: PRODUCT_STATUS = PRODUCT_STATUS.open;

  @IsEnum(PROPERTY_TYPE)
  property_type: PROPERTY_TYPE;

  @IsOptional()
  @ApiHideProperty()
  created_by_id?: number;

  @IsOptional()
  @ApiHideProperty()
  is_active = true;
}
