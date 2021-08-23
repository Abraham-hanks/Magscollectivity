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
    defaultValue: [],
  })
  images: string[];

  @Column
  description: string;

  @Column
  address: string;

  @Column
  state_name: string;

  @Column
  lga_name: string;

  @Column
  state_id: number;

  @Column
  lga_id: number;

  @Column({
    allowNull: false
  })
  unit_price: number;

  @Column({
    allowNull: false
  })
  total_units: number;

  @Column({
    allowNull: false
  })
  available_units: number;

  @Column(DataType.VIRTUAL)
  get units_sold() {
    return this.getDataValue('total_units') - this.getDataValue('available_units');
  }

  @Column({
    defaultValue: false
  })
  can_cancel_subscription: boolean;

  @Column({
    defaultValue: false
  })
  can_pause_subscription: boolean;

  @Column
  size_per_unit: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  features: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  coordinates: string[];

  @Column({
    defaultValue: true
  })
  shd_pay_commission: boolean;

  @Column({
    type: DataType.ARRAY(DataType.STRING)
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
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    allowNull: false
  })
  created_by_id: number;

  @Column
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
