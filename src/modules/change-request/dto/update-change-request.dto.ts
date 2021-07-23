import { ApiHideProperty, PartialType, PickType } from "@nestjs/swagger";
import { IsOptional, IsPositive, IsString } from "class-validator";
import { CreateChangeRequestDto } from "./create-change-request.dto";

export class UpdateChangeRequestStatus extends PartialType(
  PickType(CreateChangeRequestDto, ['request_status'] as const)
) {
  @IsOptional()
  @IsString()
  disapproval_reason?: string;

  @IsOptional()
  @IsPositive()
  charge_id?: number;

  @ApiHideProperty()
  @IsOptional()
  admin_id: number;
}