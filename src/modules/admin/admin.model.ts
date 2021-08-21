import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AuthModel } from '../auth/auth.model';
import { ADMIN_TYPES } from './constants';

@Table({
  tableName: 'admins',
  timestamps: true,
  paranoid: true
})

export class AdminModel extends BaseModel {
  @Column({
    allowNull: false
  })
  auth_id: number;

  @Column({
    allowNull: false
  })
  firstname: string;

  @Column({
    allowNull: false
  })
  lastname: string;

  @Column({
    allowNull: false
  })
  email: string;

  @Column({
    defaultValue: 'admin',
    type: DataType.ENUM('admin', 'super_admin')
  })
  type: ADMIN_TYPES;

  @Column({
    defaultValue: true
  })
  is_active: boolean;

  @BelongsTo(() => AuthModel, 'auth_id')
  auth: AuthModel;
}
