import { BelongsTo, Column, ForeignKey, HasOne, Table, DataType } from 'sequelize-typescript';
// import { DataTypes } from 'sequelize/types';
import { BaseModel } from 'src/database/models/base.model';
import { AdminModel } from '../admin/admin.model';
import { CustomerModel } from '../customer/models/customer.model';
import { RoleModel } from '../role/models/role.model';


@Table({
  tableName: 'auths',
  timestamps: true,
  paranoid: true
})

export class AuthModel extends BaseModel {
  @Column({
    allowNull: false
  })
  firstname: string;

  @Column({
    allowNull: false
  })
  lastname: string;

  @Column({
    allowNull: true
  })
  middlename: string;

  @Column({
    allowNull: true
  })
  user_id: number;

  @Column({
    allowNull: false
  })
  email: string;

  @Column({
    allowNull: true // for admins
  })
  phone: string;

  @Column({
    allowNull: false
  })
  hash: string;

  // @Column({
  //   allowNull: false
  // })
  // salt: string;

  @Column({
    allowNull: false
  })
  is_active: boolean;

  @Column({
    allowNull: false
  })
  role_id: number;

  @Column({
    allowNull: false,
    type: DataType.ENUM('super_admin', 'admin', 'realtor', 'customer')
  })
  role_name: string;

  @Column({
    allowNull: true
  })
  last_login_at: Date;

  @Column({
    defaultValue: 0
  })
  login_count: number;

  @Column({
    allowNull: true
  })
  last_ip: string;

  @Column({
    allowNull: true
  })
  last_device_type: string;

  @Column({
    allowNull: false
  })
  two_fa_enabled: boolean;

  @Column({
    allowNull: true
  })
  two_fa_type: string;

  // associations
  @BelongsTo(() => RoleModel, 'role_id')
  role: RoleModel;

  @HasOne(() => CustomerModel, 'auth_id')
  customer: CustomerModel;

  @HasOne(() => AdminModel, 'auth_id')
  admin: AdminModel;
}
