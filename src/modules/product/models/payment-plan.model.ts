import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AdminModel } from 'src/modules/admin/admin.model';
import { PAYMENT_PLAN_TYPE } from '../constants';

@Table({
  tableName: 'payment_plans',
  timestamps: true,
  paranoid: true
})

export class PaymentPlanModel extends BaseModel {

  @Column({
    allowNull: false,
  })
  product_id: number;

  @Column({
    allowNull: true,
  })
  minimun_no_units: number; // specify minimun_units for payment plan

  @Column({
    allowNull: true,
  })
  minimun_deposit_amount: string; // specify minimun_amount for 1st payment to reserve unit

  @Column({
    allowNull: false,
  })
  duration: number;

  @Column({
    allowNull: false,
  })
  amount_per_unit: string;
  // amount_per_unit: number;

  @Column({
    allowNull: false,
  })
  type: PAYMENT_PLAN_TYPE;

  @Column({
    allowNull: false,
  })
  created_by_id: number;

  @Column({
    defaultValue: true
  })
  is_active: boolean;

  @Column
  updated_by_id: number;

  // associations
  
  // @BelongsToMany(() => ProductModel, 'product_id')
  // product: ProductModel[]

  @BelongsTo(() => AdminModel, 'created_by_id')
  created_by: AdminModel

  @BelongsTo(() => AdminModel, 'updated_by_id')
  updated_by: AdminModel
}
