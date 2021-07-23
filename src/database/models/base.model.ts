import { CreatedAt, DeletedAt, Model, UpdatedAt } from 'sequelize-typescript';
import { Exclude } from 'class-transformer';

export abstract class BaseModel extends Model<BaseModel> {
  id: number;

  meta: any | JSON = {};

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @Exclude()
  @DeletedAt
  deleted_at?: Date;
}
