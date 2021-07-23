import { IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class RoleQueryFiltersDto extends BaseQueryFiltersDto {

  @IsOptional()
  name?: string;

  @IsOptional()
  is_active?: boolean;
}
