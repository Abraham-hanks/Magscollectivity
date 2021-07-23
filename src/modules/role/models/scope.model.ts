import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';

@Table({
  tableName: 'scopes',
  timestamps: true,
  paranoid: true
})

export class ScopeModel extends BaseModel {

  @Column({
    allowNull: false
  })
  name: string

  @Column({
  })
  description?: string

  @Column({
  })
  created_by_id?: number;

  @Column({
    defaultValue: true
  })
  is_active: boolean
}
