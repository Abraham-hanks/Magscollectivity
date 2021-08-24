import { ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsUrl, Min } from 'class-validator';
import { PRODUCT_SUB_PAYMENT_METHOD } from 'src/modules/product-subscription/constants';

export class FundWalletDto {

  @ApiHideProperty()
  @IsOptional()
  customer_id?: number

  @IsNumber()
  @Min(1000 * 100) // min amount is 1000 
  amount: number

  @IsUrl({
    require_tld: false
  })
  @IsOptional()
  callback_url?: string;
}

export class ProductSubPurchaseDto extends FundWalletDto {

  @IsPositive()
  product_sub_id: number;

  @IsEnum(PRODUCT_SUB_PAYMENT_METHOD)
  payment_method: PRODUCT_SUB_PAYMENT_METHOD;
}
