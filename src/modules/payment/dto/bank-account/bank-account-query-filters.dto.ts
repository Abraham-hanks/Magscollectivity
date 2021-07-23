import { IsBoolean, IsNumberString, IsOptional, IsString } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class BankAccountQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  @IsNumberString()
  customer_id?: number;

  @IsOptional()
  @IsNumberString()
  bank_id?: number;

  @IsOptional()
  @IsString()
  account_number?: string;

  @IsOptional()
  @IsString()
  account_name?: string; 

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export const BankAccountQueryFiltersArray = [
  "customer_id",
  "bank_id",
  "account_number",
  "account_name",
  "is_active"
];
