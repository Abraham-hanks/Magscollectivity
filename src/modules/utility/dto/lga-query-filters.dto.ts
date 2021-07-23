import { IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class LgaQueryFiltersDto extends BaseQueryFiltersDto {

  @IsNumberString()
  state_id: number;

  @IsOptional()
  is_active?: boolean;
}
