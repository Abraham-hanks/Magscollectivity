import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { TXTN_CHANNEL, TXTN_POSITION, TXTN_STATUS, TXTN_TYPE } from '../constants';

export class TxtnQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  customer_id?: number;

  @IsOptional()
  reference?: string;

  @IsOptional()
  @IsEnum(TXTN_TYPE)
  txtn_type?: TXTN_TYPE;

  @IsOptional()
  channel?: TXTN_CHANNEL;

  @IsOptional()
  position?: TXTN_POSITION

  @IsOptional()
  status?: TXTN_STATUS

}

export const TxtnQueryFiltersArray = [
  'customer_id', 
  'reference', 
  'txtn_type',
  'channel',
  'position',
  'status',
];
