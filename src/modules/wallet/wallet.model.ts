import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
// import { TxtnModel } from '../txtn/txtn.model';
import { CustomerModel } from '../customer/models/customer.model';

@Table({
  tableName: 'wallets',
  timestamps: true,
  paranoid: true
})

export class WalletModel extends BaseModel {

  @Column
  name: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
    defaultValue: 0
  })
  balance: string

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
    defaultValue: 0
  })
  book_balance: string;

  @Column({
    allowNull: true
  })
  customer_id: number;

  @Column({
    allowNull: true
  })
  vba_no: string;

  @Column({
    defaultValue: false
  })
  is_admin_wallet: boolean;

  @Column({
    defaultValue: true
  })
  is_active: boolean;

  // associations
  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  // @HasMany(() => TxtnModel, 'wallet_id')
  // txtns: TxtnModel;
}
