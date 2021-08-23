import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateBankAccountDto {
  @ApiHideProperty()
  @IsPositive()
  @IsOptional()
  customer_id?: number;

  @Length(3, 3)
  bank_code: string;

  @IsString()
  bank_name: string;

  @Length(10, 10)
  account_number: string;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  account_name?: string; 

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  recipient_code?: string;

  @ApiHideProperty()
  @IsOptional()
  is_active = true;
}
