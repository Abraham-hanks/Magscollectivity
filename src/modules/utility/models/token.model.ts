import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AuthModel } from 'src/modules/auth/auth.model';
import { CustomerModel } from 'src/modules/customer/models/customer.model';
import { TxtnModel } from 'src/modules/txtn/models/txtn.model';


@Table({
  tableName: 'tokens',
  timestamps: true,
  paranoid: false
})

export class TokenModel extends BaseModel {

  @Column({
    allowNull: false
  })
  auth_id: number;

  @Column({
    // allowNull: false
  })
  user_id: number;

  @Column
  txtn_id: number;

  @Column
  expires_at: Date;

  // @Column
  // is_active: boolean;

  @Column
  is_expired: boolean;

  @Column
  is_verified: boolean;

  @Column({
    allowNull: false
  })
  value: string;

  @Column({
    allowNull: false
  })
  type: string;

  @Column({
    allowNull: false
  })
  valid_for: number;

  @Column({
    allowNull: true
  })
  no_of_xters: number; // for token regeneration

  @Column(DataType.VIRTUAL)
  get is_valid() {
    const timeDiff = this.getDataValue('expires_at').getTime() - new Date().getTime();
    if (timeDiff > 0)
      return true;
    else
      return false;
  }

  // associations
  @BelongsTo(() => AuthModel, 'auth_id')
  auth: AuthModel;

  // @BelongsTo(() => CustomerModel, 'customer_id')
  // customer: CustomerModel;

  @BelongsTo(() => TxtnModel, 'txtn_id')
  txtn: TxtnModel;

}
