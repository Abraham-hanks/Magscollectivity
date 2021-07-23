import { Column, DataType, Table } from 'sequelize-typescript';
// import { DataType } from 'sequelize/types';
import { BaseModel } from 'src/database/models/base.model';

@Table({
  tableName: 'roles',
  timestamps: true,
  paranoid: true
})

export class RoleModel extends BaseModel {

  @Column({
    allowNull: false
  })
  name: string

  @Column({
  })
  description?: string

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  scopes: Array<string>;

  @Column({
  })
  created_by_id?: number;

  @Column({
    defaultValue: true
  })
  is_active: boolean

  // @Default(value: any)
}
