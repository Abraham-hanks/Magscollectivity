import { BelongsTo, Column, Table } from "sequelize-typescript";
import { BaseModel } from "src/database/models/base.model";
import { AdminModel } from "src/modules/admin/admin.model";
import { ChangeRequestModel } from "src/modules/change-request/change-request.model";
import { CustomerModel } from "src/modules/customer/models/customer.model";
import { ProductSubModel } from "src/modules/product-subscription/product-sub.model";
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
  product_sub_id: number;

  @Column
  change_request_id: number;

  @Column({
    allowNull: false
  })
  amount: number;

  @Column
  status: CHARGE_STATUS;

  @Column
  type: CHARGE_TYPE;

  @Column
  date_due: Date;

  @Column
  created_by_id: number;

  @Column
  updated_by_id: number;

  // associations
  @BelongsTo(() => AdminModel, 'created_by_id')
  admin: AdminModel;

  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  @BelongsTo(() => ChangeRequestModel, 'change_request_id')
  changeRequest: ChangeRequestModel;

  @BelongsTo(() => ProductSubModel, 'product_sub_id')
  productSub: ProductSubModel;
}
