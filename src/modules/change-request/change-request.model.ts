import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AdminModel } from '../admin/admin.model';
import { CustomerModel } from '../customer/models/customer.model';
import { ProductSubModel } from '../product-subscription/product-sub.model';

@Table({
  tableName: 'change_requests',
  timestamps: true,
  paranoid: true
})

export class ChangeRequestModel extends BaseModel {

  @Column({
    allowNull: false
  })
  customer_id: number;

  @Column
  product_sub_id: number;

  @Column({
    allowNull: false
  })
  type: string;

  @Column
  description: string;

  @Column
  comments: string;

  @Column
  approved_on: Date;

  @Column({
    allowNull: false
  })
  status: string;

  @Column
  updated_by_id: number;

  // associations

  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel

  @BelongsTo(() => ProductSubModel, 'product_sub_id')
  product_sub: ProductSubModel

  @BelongsTo(() => AdminModel, 'updated_by_id')
  admin: AdminModel
}
