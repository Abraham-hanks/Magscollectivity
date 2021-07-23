import { IsPositive, IsString } from 'class-validator';
import { TokenTypes } from '../../constants';

export class ValidateTokenDto {
  
  @IsPositive()
  id: number;

  @IsPositive()
  token_id: number;

  @IsString()
  value: string;

  type: TokenTypes;
}