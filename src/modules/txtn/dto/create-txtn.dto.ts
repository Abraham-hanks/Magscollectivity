import { ApiHideProperty, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { BaseCreateDto } from 'src/common/dto/base.dto';
import { TXTN_CHANNEL, TXTN_POSITION, TXTN_STATUS, TXTN_TYPE } from '../constants';

@ApiTags('Txtn')
export class CreateTxtnDto extends BaseCreateDto {

  @ApiHideProperty()
  @IsEnum(TXTN_TYPE)
  type?: TXTN_TYPE;

  @ApiHideProperty()
  @IsEnum(TXTN_TYPE)
  channel?: TXTN_CHANNEL;

  @IsOptional()
  description?: string;

  @ApiHideProperty()
  @IsOptional()
  reference?: string;

  @ApiHideProperty()
  wallet_id: number;

  @ApiHideProperty()
  customer_id?: number;
  
  @ApiHideProperty()
  @IsOptional()
  admin_id?: number;

  @ApiHideProperty()
  @IsOptional()
  fund_request_id?: number;

  @ApiHideProperty()
  @IsOptional()
  withdrawal_request_id?: number;

  @IsOptional()
  charge_id?: number;

  @IsOptional()
  product_sub_id?: number;

  total_amount: number;

  actual_amount?: number;

  @ApiHideProperty()
  charges?: number;

  @ApiHideProperty()
  old_balance?: number;

  @ApiHideProperty()
  new_balance?: number;

  @ApiHideProperty()
  position?: TXTN_POSITION;

  @ApiHideProperty()
  status? = TXTN_STATUS.initiated;

}
