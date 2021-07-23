import { ApiHideProperty, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsPositive, Min } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { BaseCreateDto } from 'src/common/dto/base.dto';
import { WITHDRAWAL_REQUEST_STATUS } from '../../constants';

@ApiTags('Withdrawal Request')
export class CreateWithdrawalRequestDto extends BaseCreateDto {

  @IsPositive()
  @IsOptional()
  @ApiHideProperty()
  customer_id?: number;

  @IsPositive()
  @Min(1000 * 100)
  amount: number;
}

export class ApproveWithdrawalRequestDto {

  @IsPositive()
  id: number
   
  @IsPositive()
  @IsOptional()
  @ApiHideProperty()
  updated_by_id?: number;

  @ApiHideProperty()
  @IsOptional()
  status?: WITHDRAWAL_REQUEST_STATUS;

  @IsBoolean()
  use_paystack? = false;
}

export class DeclineWithdrawalRequestDto {

  @IsPositive()
  id: number
   
  @IsPositive()
  @IsOptional()
  @ApiHideProperty()
  updated_by_id?: number;

  @IsOptional()
  comments?: string;

  @ApiHideProperty()
  @IsOptional()
  status?: WITHDRAWAL_REQUEST_STATUS;
}


export class WithdrawalRequestQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  customer_id?: number;

  @IsOptional()
  status?: WITHDRAWAL_REQUEST_STATUS;

  @IsOptional()
  updated_by_id?: number;

  @IsOptional()
  use_paystack?: boolean;
}

export const WithdrawalRequestQueryFiltersArray = [
  'customer_id',
  'status',
  'use_paystack',
  'updated_by_id',
];