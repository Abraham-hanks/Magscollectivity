import { ApiHideProperty } from "@nestjs/swagger";

export abstract class BaseCreateDto {
  @ApiHideProperty()
  meta?: any;
}

export abstract class BaseDto {
  readonly id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly meta?: JSON
  @ApiHideProperty()
  readonly deleted_at?: Date;
}

