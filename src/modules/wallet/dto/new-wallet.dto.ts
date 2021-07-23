import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class NewWalletDto {

  @IsPositive()
  customer_id: number

  @IsOptional()
  @IsPositive()
  @ApiHideProperty()
  vba_no?: string
}
