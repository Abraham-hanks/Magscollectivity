import { ApiHideProperty, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsPositive, IsUrl, Min } from 'class-validator';
import { isNotNullOnValue } from 'src/common/decorator/validator/is-not-null-on-value.decorator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { BaseCreateDto } from 'src/common/dto/base.dto';
import { FUND_REQUEST_PURPOSE, FUND_REQUEST_STATUS } from '../../constants';

@ApiTags('Fund Request')
export class CreateFundRequestDto extends BaseCreateDto {

  @IsPositive()
  @IsOptional()
  @ApiHideProperty()
  customer_id?: number;
  
  @IsUrl()
  proof_of_payment: string;

  @IsOptional()
  bank_reference?: string;

  @IsPositive()
  @Min(1000 * 100)
  amount: number;

  @IsOptional()
  @isNotNullOnValue('purpose', FUND_REQUEST_PURPOSE.product_sub_payment)
  product_sub_id?: number;

  @IsEnum(FUND_REQUEST_PURPOSE)
  purpose: FUND_REQUEST_PURPOSE;
}

export class ApproveFundRequestDto {

  @IsPositive()
  id: number
   
  @IsPositive()
  @IsOptional()
  @ApiHideProperty()
  updated_by_id?: number;

  @ApiHideProperty()
  @IsOptional()
  status?: FUND_REQUEST_STATUS;

  @IsBoolean()
  ignore_amount_difference? = false;
}

export class DeclineFundRequestDto {

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
  status?: FUND_REQUEST_STATUS;
}


export class FundRequestQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  customer_id?: number;

  @IsOptional()
  bank_reference?: string;

  @IsOptional()
  status?: FUND_REQUEST_STATUS;

  @IsOptional()
  purpose?: FUND_REQUEST_PURPOSE;

  @IsOptional()
  updated_by_id?: number;
}

export const FundRequestQueryFiltersArray = [
  'customer_id',
  'bank_reference',
  'status',
  'purpose',
  'updated_by_id',
];