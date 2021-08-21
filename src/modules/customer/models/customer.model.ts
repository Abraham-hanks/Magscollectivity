import { BelongsTo, Column, DataType, HasMany, HasOne, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AuthModel } from '../../auth/auth.model';
import { BankAccountModel } from '../../payment/models/bank-account.model';
import { WalletModel } from '../../wallet/wallet.model';
import { ENUM_GENDER, REALTOR_STAGE } from '../constants';
import { RealtorTreeModel } from './realtor-tree.model';

@Table({
  tableName: 'customers',
  timestamps: true,
  paranoid: true
})

export class CustomerModel extends BaseModel {
  @Column({
    allowNull: false
  })
  auth_id: number;

  @Column({
    allowNull: false
  })
  firstname: string;

  @Column({
    allowNull: false
  })
  lastname: string;

  @Column({
    allowNull: true
  })
  middlename: string;

  @Column({
    allowNull: false
  })
  email: string;

  @Column({
    allowNull: false
  })
  phone: string;

  @Column({
    allowNull: true
  })
  dob: Date;

  @Column({
    type: DataType.ENUM('male', 'female', 'other')
  })
  gender: ENUM_GENDER;

  @Column
  marital_status: string;

  @Column
  profile_pic?: string;

  @Column
  address?: string;

  @Column
  state_name?: string;

  @Column
  lga_name?: string;

  @Column
  lga_id?: number;

  @Column
  state_id?: number;

  @Column
  country?: string;

  @Column({
    defaultValue: false
  })
  email_verified: boolean;

  @Column
  referred_by_id: number;

  @Column({
    allowNull: true
  })
  wallet_id: number;

  // next of kin details
  @Column
  next_of_kin_full_name?: string;

  @Column
  next_of_kin_phone?: string;
  
  @Column
  next_of_relationship?: string;

  @Column
  next_of_kin_address?: string;

  // realtor fields 

  @Column({
    defaultValue: false
  })
  is_realtor: boolean;

  @Column
  realtor_stage: REALTOR_STAGE;

  @Column({
    allowNull: true
  })
  bvn_verified: boolean;

  @Column({
    allowNull: true
  })
  referral_code: string; // this will be phone number


  // associations
  @BelongsTo(() => AuthModel, 'auth_id')
  auth: AuthModel;

  @HasOne(() => BankAccountModel, 'customer_id')
  bank_account: BankAccountModel;

  @HasOne(() => RealtorTreeModel, 'realtor_id')
  realtor_tree: RealtorTreeModel;

  @BelongsTo(() => CustomerModel, 'referred_by_id')
  upline: CustomerModel;

  @HasMany(() => CustomerModel, 'referred_by_id')
  clients: CustomerModel;

  @HasMany(() => CustomerModel, 'referred_by_id')
  downline: CustomerModel[];

  @BelongsTo(() => WalletModel, 'wallet_id')
  wallet: WalletModel;
}
