import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AdminModel } from '../../admin/admin.model';
import { CustomerModel } from '../../customer/models/customer.model';
import { ProductSubModel } from '../../product-subscription/product-sub.model';
import { WalletModel } from '../../wallet/wallet.model';
import { TXTN_POSITION, TXTN_STATUS } from '../constants';
import { FundRequestModel } from './fund-request.model';
import { WithdrawalRequestModel } from './withdrawal-request.model';

@Table({
  tableName: 'transactions',
  timestamps: true,
  paranoid: true
})

export class TxtnModel extends BaseModel {

  @Column({
    allowNull: false
  })
  type: string

  @Column
  channel: string;

  @Column
  description: string;
  
  @Column({
    allowNull: false
  })
  reference: string;

  @Column
  wallet_id: number;

  @Column
  customer_id?: number;

  @Column
  admin_id: number;

  @Column
  fund_request_id: number;

  @Column
  withdrawal_request_id: number;

  @Column
  charge_id: number;

  @Column
  product_sub_id: number;

  @Column({
    allowNull: false
  })
  total_amount: string;

  @Column
  actual_amount: number;

  @Column
  charges: number;

  @Column
  old_balance: string;

  @Column
  new_balance: string;

  @Column({
    allowNull: true,
  })
  position?: TXTN_POSITION;

  @Column({
    defaultValue: false,
  })
  is_admin_txtn?: boolean;

  @Column({
    defaultValue: TXTN_STATUS.initiated
  })
  status: string;

  @Column({
    type: DataType.JSON
  })
  paystack_auth;

  // associations
  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  @BelongsTo(() => WalletModel, 'wallet_id')
  wallet: WalletModel;

  @BelongsTo(() => AdminModel, 'admin_id')
  admin: AdminModel;

  @BelongsTo(() => ProductSubModel, 'product_sub_id')
  product_subscription: ProductSubModel

  @BelongsTo(() => FundRequestModel, 'fund_request_id')
  fund_request: FundRequestModel;

  @BelongsTo(() => WithdrawalRequestModel, 'withdrawal_request_id')
  withdrawal_request: WithdrawalRequestModel;
}
