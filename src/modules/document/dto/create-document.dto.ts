import { ApiHideProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsPositive, IsString, IsUrl } from "class-validator";
import { DOCUMENT_TYPE } from "../constants";

export class CreateDocumentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsPositive()
  customer_id: number;

  @ApiHideProperty()
  @IsOptional()
  created_by_id: number;

  @IsUrl()
  url: string;

  @IsEnum(DOCUMENT_TYPE)
  type: DOCUMENT_TYPE
}
