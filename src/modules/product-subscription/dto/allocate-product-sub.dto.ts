import { ApiHideProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class AllocateProductSubDto {
  @ApiHideProperty()
  @IsOptional()
  is_allocated?: true;

  @IsOptional()
  @IsArray()
  allocations?: string[];

  @IsOptional()
  @ApiHideProperty()
  updated_by_id?: number;

  @IsOptional()
  @ApiHideProperty()
  allocated_on?: Date;
}
