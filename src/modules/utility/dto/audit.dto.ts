import { IsOptional, IsString, IsPositive } from "class-validator";
import { BaseQueryFiltersDto } from "src/common/dto/base-query-filters.dto";


export type CreateAuditDto = {
  name?: string;

  label?: string;

  auth_id: number | null;

  module: string;

  request_body?: JSON | any;

  response_body?: JSON | any;

  response_message: string,

  status_code: number,

  controller_method?: string;

  request_method: string;

  request_url: string;

  user_agent?: string;

  ip_address?: string;
}

export class AuditQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  @IsPositive()
  auth_id?: number;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  module?: string;

  @IsOptional()
  @IsString()
  status_code?: number;

  @IsOptional()
  @IsString()
  request_method?: string;
}

export const AuditQueryFiltersArray = [
  'auth_id',
  'label',
  'module',
  'status_code',
  'request_method',
  //'response_message',
  //'request_url',
  //'ip_address',
];
