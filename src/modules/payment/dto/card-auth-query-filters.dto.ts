import { IsBoolean, IsNumberString, IsOptional, IsString } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class CardAuthQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  @IsNumberString()
  customer_id?: number;

  @IsOptional()
  @IsString()
  bank_name?: string;

  @IsOptional()
  @IsString()
  account_name?: string; 

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export const CardAuthQueryFiltersArray = [
  "customer_id",
  "bank_name",
  "account_name",
  "is_active"
];
