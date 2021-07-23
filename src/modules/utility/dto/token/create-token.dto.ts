import { IsDate, IsPositive, MinLength } from 'class-validator';
import { TokenTypes } from '../../constants';

export class CreateTokenDto {
  
  @IsPositive()
  auth_id: number;

  @IsPositive()
  customer_id?: number;

  @IsPositive()
  txtn_id?: number;

  // @IsDate()
  expires_at?: Date;

  // is_active? = true;

  is_expired? = false;

  is_verified? = false;

  @MinLength(4)
  value: string;

  type: TokenTypes;

  no_of_xters: number;

  // others
  @IsPositive()
  valid_for: number // in mins. used to calculate expires_at
  
}