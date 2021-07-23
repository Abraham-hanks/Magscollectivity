import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AdminModel } from '../../admin/admin.model';
import { CustomerModel } from '../../customer/models/customer.model';
import { FUND_REQUEST_PURPOSE, FUND_REQUEST_STATUS } from '../constants';

@Table({
  tableName: 'fund_requests',
  timestamps: true,
  paranoid: false
})

export class FundRequestModel extends BaseModel {

  @Column({
    allowNull: false
  })
  customer_id: number;

  @Column({
    allowNull: false
  })
  proof_of_payment: string;

  @Column({
    allowNull: false
  })
  purpose: FUND_REQUEST_PURPOSE;

  @Column({
    allowNull: false
  })
  amount?: string;

  @Column({
    defaultValue: FUND_REQUEST_STATUS.initiated
  })
  status: FUND_REQUEST_STATUS;

  @Column
  bank_reference?: string;

  @Column
  product_sub_id?: number;

  @Column
  updated_by_id?: number;

  @Column
  comments: string;

  // associations

  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel

  @BelongsTo(() => AdminModel, 'updated_by_id')
  updated_by: AdminModel
}
