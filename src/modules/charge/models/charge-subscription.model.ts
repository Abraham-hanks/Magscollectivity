import { BelongsTo, Column, Table } from "sequelize-typescript";
import { BaseModel } from "src/database/models/base.model";
import { CustomerModel } from "src/modules/customer/models/customer.model";
import { CHARGE_SUBSCRIPTION_STATUS } from "../constants";
import { ChargeModel } from "./charge.model";

@Table({
  tableName: 'charge_subscriptions',
  timestamps: true,
  paranoid: true
})

export class ChargeSubscriptionModel extends BaseModel {
  @Column({
    allowNull: false
  })
  name: string;

  @Column({
    allowNull: false
  })
  description: string;

  @Column({
    allowNull: false
  })
  customer_id: number;

  @Column({
    allowNull: false
  })
  charge_id: number;

  @Column
  duration: number;

  @Column
  start_date: Date;

  @Column({
    // allowNull: false
  })
  end_date: Date;

  @Column({
    // allowNull: false
  })
  next_deduction_date: Date;

  @Column({
    // allowNull: false
  })
  amount: number;

  @Column({
    allowNull: false
  })
  status: CHARGE_SUBSCRIPTION_STATUS


  // associations
  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  @BelongsTo(() => ChargeModel, 'charge_id')
  charge: ChargeModel;
}
