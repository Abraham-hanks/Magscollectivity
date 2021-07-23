import { ApiHideProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

enum ORDER_ENUM {
  ASC = 'ASC',
  DESC = 'DESC'
}

export abstract class BaseQueryFiltersDto {

  @ApiHideProperty()
  id? : number;

  // '?:' format is used intentionally so that Swagger recognizes the dtos properly
  page?: number = 1;

  @Min(1)
  @Max(200)
  limit?: number = 20;

  order?: ORDER_ENUM = ORDER_ENUM.DESC;

  sort_by?: string = 'created_at';

  search?: string;

  start_date?: Date;

  end_date?: Date;

  @ApiHideProperty()
  where?: any
}
