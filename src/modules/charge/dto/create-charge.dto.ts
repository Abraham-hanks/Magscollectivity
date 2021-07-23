import { ApiHideProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { CHARGE_STATUS, CHARGE_TYPE } from "../constants";

export class CreateChargeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsPositive()
  customer_id: number;

  @IsPositive()
  product_id: number;

  @Min(100 * 100)
  amount: number;

  @IsEnum(CHARGE_TYPE)
  type: CHARGE_TYPE;

  @ApiHideProperty()
  @IsOptional()
  status? = CHARGE_STATUS.initiated;

  @ApiHideProperty()
  @IsOptional()
  created_by_id?: number;

  @ApiHideProperty()
  @IsOptional()
  is_active? = true;
}
