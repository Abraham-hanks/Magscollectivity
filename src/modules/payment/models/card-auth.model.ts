import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { CustomerModel } from 'src/modules/customer/models/customer.model';

@Table({
  tableName: 'card_auths',
  timestamps: true,
  paranoid: true
})

export class CardAuthModel extends BaseModel {
  @Column({
    allowNull: false
  })
  customer_id: number;

  @Column({
    allowNull: false
  })
  auth_code: string; 

  @Column({
    allowNull: false
  })
  card_type: string; 

  @Column({
    allowNull: false
  })
  last4: string;

  @Column({
    allowNull: false
  })
  exp_month: string;

  @Column({
    allowNull: false
  })
  exp_year: string;

  @Column
  bin: string; 

  @Column({
    allowNull: false
  })
  bank_name: string;

  @Column
  channel: string;

  @Column({
    allowNull: false
  })
  signature: string;

  @Column
  reusable: boolean;

  @Column
  country_code: string;

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
