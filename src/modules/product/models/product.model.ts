import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AdminModel } from 'src/modules/admin/admin.model';
import { PRODUCT_STATUS, PROPERTY_TYPE } from '../constants';
import { PaymentPlanModel } from './payment-plan.model';


@Table({
  tableName: 'products',
  timestamps: true,
  paranoid: true
})

export class ProductModel extends BaseModel {

  @Column({
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  images: string[];

  @Column({
    allowNull: false
  })
  description: string;

  @Column({
    allowNull: true
  })
  address: string;

  @Column({
    allowNull: true
  })
  state_id: number;

  @Column({
    allowNull: true
  })
  lga_id: number;

  @Column({
    allowNull: true
  })
  state_name: string;

  @Column({
    allowNull: true
  })
  lga_name: string;

  @Column({
    allowNull: false
  })
  unit_price: string;

  @Column({
    allowNull: false
  })
  total_units: number;

  @Column({
    defaultValue: 0
  })
  available_units: number;

  @Column({
    defaultValue: false
  })
  can_cancel_subscription: boolean;

  @Column({
    defaultValue: false
  })
  can_pause_subscription: boolean;

  @Column({
    allowNull: true
  })
  size_per_unit: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  features: string[];

  @Column({
    allowNull: true,
    type: DataType.ARRAY(DataType.STRING),
  })
  coordinates: string[];

  @Column({
    defaultValue: true
  })
  shd_pay_commission: boolean;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  locked_fields: string[];

  @Column({
    allowNull: false,
    defaultValue: PRODUCT_STATUS.open
  })
  status: string;

  @Column({
    allowNull: false,
    defaultValue: PROPERTY_TYPE.land
  })
  property_type: string;

  @Column({
  })
  is_active: boolean;

  @Column({
    allowNull: false
  })
  created_by_id: number;

  @Column({})
  updated_by_id: number;

  // associations

  @HasMany(() => PaymentPlanModel, 'product_id')
  payment_plans: PaymentPlanModel[];

  @BelongsTo(() => AdminModel, {
    foreignKey: 'created_by_id',
    as: 'created_by'
  })
  created_by: AdminModel

  @BelongsTo(() => AdminModel, {
    foreignKey: 'updated_by_id',
    as: 'updated_by'
  })
  updated_by: AdminModel
}
