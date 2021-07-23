import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AdminModel } from '../admin/admin.model';
import { ChargeModel } from '../charge/models/charge.model';
import { CustomerModel } from '../customer/models/customer.model';
import { ProductSubModel } from '../product-subscription/product-sub.model';
import { ProductModel } from '../product/models/product.model';
import { PAYMENT_TYPE } from './constants';

@Table({
  tableName: 'change_requests',
  timestamps: true,
  paranoid: true
})

export class ChangeRequestModel extends BaseModel {
  @Column({
    allowNull: false
  })
  product_sub_id: number;

  @Column({
    allowNull: false
  })
  customer_id: number;

  @Column({
    allowNull: false
  })
  type: string;

  @Column({
    allowNull: false
  })
  payment_type: PAYMENT_TYPE;

  @Column({
    // allowNull: false
  })
  charge_id: number;

  @Column
  description: string;

  @Column({
    // allowNull: false
  })
  disapproval_reason: string;

  @Column({
    defaultValue: false
  })
  approved: boolean;

  @Column({
    // allowNull: false
  })
  approval_date: Date;

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

  @BelongsTo(() => ChargeModel, 'charge_id')
  charge: ChargeModel

  @BelongsTo(() => AdminModel, 'updated_by_id')
  admin: AdminModel
}
