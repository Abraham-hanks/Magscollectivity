import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AdminModel } from '../../admin/admin.model';
import { CustomerModel } from '../../customer/models/customer.model';
import { WITHDRAWAL_REQUEST_STATUS } from '../constants';

@Table({
  tableName: 'withdrawal_requests',
  timestamps: true,
  paranoid: false
})

export class WithdrawalRequestModel extends BaseModel {

  @Column({
    allowNull: false
  })
  customer_id: number;

  @Column({
    allowNull: false
  })
  amount?: string;

  @Column({
    defaultValue: false
  })
  use_paystack?: boolean;

  @Column
  comments?: string;

  @Column({
    defaultValue: WITHDRAWAL_REQUEST_STATUS.initiated
  })
  status: WITHDRAWAL_REQUEST_STATUS;

  @Column
  updated_by_id?: number;

  // associations
  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel

  @BelongsTo(() => AdminModel, 'updated_by_id')
  updated_by: AdminModel
}
