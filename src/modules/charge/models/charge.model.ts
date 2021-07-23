import { BelongsTo, Column, Table } from "sequelize-typescript";
import { BaseModel } from "src/database/models/base.model";
import { AdminModel } from "src/modules/admin/admin.model";
import { ChangeRequestModel } from "src/modules/change-request/change-request.model";
import { CustomerModel } from "src/modules/customer/models/customer.model";
import { CHARGE_STATUS, CHARGE_TYPE } from "../constants";

@Table({
  tableName: 'charges',
  timestamps: true,
  paranoid: true
})

export class ChargeModel extends BaseModel {
  @Column({
    allowNull: false
  })
  name: string;

  @Column
  description: string;

  @Column({
    allowNull: false
  })
  customer_id: number;

  @Column
  change_request_id: number;

  @Column({
    allowNull: false
  })
  amount: number;

  @Column
  type: CHARGE_TYPE;

  @Column
  status: CHARGE_STATUS;

  @Column
  created_by_id: number;

  @Column({
    defaultValue: true
  })
  is_active: boolean;


  // associations
  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  @BelongsTo(() => AdminModel, 'created_by_id')
  admin: AdminModel;

  @BelongsTo(() => ChangeRequestModel, 'change_request_id')
  changeRequest: ChangeRequestModel;

  // @HasOne(() => ChargeSubscriptionModel, 'charge_id')
  // chargeSubscription: ChargeSubscriptionModel;
}