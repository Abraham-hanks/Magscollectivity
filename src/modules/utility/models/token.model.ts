import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AuthModel } from 'src/modules/auth/auth.model';
import { TxtnModel } from 'src/modules/txtn/models/txtn.model';

@Table({
  tableName: 'tokens',
  timestamps: true,
  paranoid: false
})

export class TokenModel extends BaseModel {

  @Column
  auth_id: number;

  @Column
  user_id: number;

  @Column
  txtn_id: number;

  @Column({
    allowNull: false
  })
  expires_at: Date;

  // @Column
  // is_active: boolean;

  @Column({
    defaultValue: false
  })
  is_expired: boolean;

  @Column({
    defaultValue: false
  })
  is_verified: boolean;

  @Column
  value: string;

  @Column
  type: string;

  @Column
  valid_for: number;

  @Column
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

  @BelongsTo(() => TxtnModel, 'txtn_id')
  txtn: TxtnModel;
}
