import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { CustomerModel } from 'src/modules/customer/models/customer.model';


@Table({
  tableName: 'bank_accounts',
  timestamps: true,
  paranoid: true
})

export class BankAccountModel extends BaseModel {
  @Column({
    allowNull: false
  })
  customer_id: number;

  @Column
  recipient_code: string;

  @Column({
    allowNull: false
  })
  bank_code: string;

  @Column({
    allowNull: false
  })
  bank_name: string;

  @Column({
    allowNull: false
  })
  account_number: string;

  @Column({
    allowNull: false
  })
  account_name: string; 

  @Column({
    defaultValue: true
  })
  is_active: boolean;

  // associations  
  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;
}
