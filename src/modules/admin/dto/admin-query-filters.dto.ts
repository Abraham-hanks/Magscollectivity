import { IsEmail, IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class AdminQueryFiltersDto extends BaseQueryFiltersDto {

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  is_active: boolean
}
