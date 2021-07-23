import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { CustomerModel } from 'src/modules/customer/models/customer.model';
import { ProductModel } from '../product/models/product.model';
import { PaymentPlanModel } from '../product/models/payment-plan.model';


@Table({
  tableName: 'product_subscriptions',
  timestamps: true,
  paranoid: true
})

export class ProductSubModel extends BaseModel {

  @Column({
    allowNull: false
  })
  customer_id: number;

  @Column({
    allowNull: false
  })
  units: number;

  @Column({
    allowNull: false
  })
  total_amount: string;

  @Column
  actual_amount: string;

  @Column({
    defaultValue: 0
  })
  amount_paid: string; // amount paid out of total amount for property

  @Column(DataType.VIRTUAL)
  get amount_left() {
    return (parseInt(this.getDataValue('total_amount')) - parseInt(this.getDataValue('amount_paid'))).toString();
  }

  // payment plan details
  @Column({
    allowNull: false
  })
  amount_per_unit: string;
  
  @Column({
    allowNull: false
  })
  is_installment: boolean;

  @Column
  duration: number;

  @Column
  start_date: Date;

  @Column
  end_date: Date;

  @Column
  next_deduction_date: Date;

  @Column({
    allowNull: false
  })
  product_id: number;

  @Column({
    allowNull: false
  })
  payment_plan_id: number;

  // @Column
  // promotion_id?: number;

  // discount
  @Column
  is_discounted?: boolean;

  @Column
  discounted_percentage: number;

  @Column({
  })
  discounted_price: string;

  @Column
  discount_type: string;

  @Column({
    allowNull: false
  })
  status: string;

  // associations
  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  @BelongsTo(() => ProductModel, 'product_id')
  product: ProductModel;

  @BelongsTo(() => PaymentPlanModel, 'payment_plan_id')
  payment_plan: PaymentPlanModel;
}
