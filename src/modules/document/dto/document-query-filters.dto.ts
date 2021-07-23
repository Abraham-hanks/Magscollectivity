import { IsOptional } from "class-validator";
import { BaseQueryFiltersDto } from "src/common/dto/base-query-filters.dto";
import { DOCUMENT_TYPE } from "../constants";

export class DocumentQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  customer_id?: number;
  
  @IsOptional()
  created_by_id?: number;

  @IsOptional()
  updated_by_id: number;

  @IsOptional()
  document_type: DOCUMENT_TYPE;
}

export const DocumentQueryFiltersArray = [
  "customer_id",
  "created_by_id",
  "updated_by_id",
  "document_type"
]