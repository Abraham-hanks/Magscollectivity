import { ApiHideProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, Length } from 'class-validator';

export class VerifyBankDto {

  @ApiHideProperty()
  @IsOptional()
  customer_id?: number

  @IsNumberString()
  @Length(10, 10)
  account_number: string

  @Length(3, 3)
  bank_code: string;
}
