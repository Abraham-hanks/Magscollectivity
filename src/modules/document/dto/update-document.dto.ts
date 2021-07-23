import { ApiHideProperty, PartialType, PickType } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateDocumentDto } from "./create-document.dto";

export class UpdateDocumentDto extends PartialType(
  PickType(CreateDocumentDto, [
    "name",
    "description",
    "type",
    "url",
  ] as const)) 
{
  @IsOptional()
  @IsBoolean()
  send_to_user: boolean;
  
  @ApiHideProperty()
  @IsOptional()
  updated_by_id: number;
}