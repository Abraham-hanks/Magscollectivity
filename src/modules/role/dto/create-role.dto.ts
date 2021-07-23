import { Optional } from '@nestjs/common';
import { MinLength } from 'class-validator';

export class CreateRoleDto {

  @MinLength(2)
  name: string;

  @Optional()
  @MinLength(2)
  description: string;

  scopes: Array<string>;

  created_by_id: number;
}
