import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { CustomerModel } from './customer.model';

@Table({
  tableName: 'realtor_trees',
  timestamps: true,
  paranoid: true
})

export class RealtorTreeModel extends BaseModel {

  @Column({
    allowNull: false
  })
  realtor_id: number;

  @Column({
    defaultValue: true
  })
  for_realtor: boolean;

  @Column({
    defaultValue: 0
  })
  no_customers_referred: number;

  // upline & downline
  @Column({
    defaultValue: [],
    type: DataType.ARRAY(DataType.INTEGER)
  })
  downline: Array<number>;

  @Column(DataType.VIRTUAL)
  get downline_count() {
    return this.getDataValue('downline').length;
  }

  @Column({
    defaultValue: [],
    type: DataType.ARRAY(DataType.JSON)
  })
  indirect_downline: Array<number>;

  // realtor sales & realtorTree
  @Column({
    defaultValue: 0
  })
  completed_sales: number;

  @Column({
    defaultValue: 0
  })
  incompleted_sales: number;

  @Column({
    defaultValue: 0
  })
  completed_sales_value: string;

  @Column({
    defaultValue: 0
  })
  incompleted_sales_value: string;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER)
  })
  products_sold_ids: Array<number>;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER)
  })
  subscription_sold_ids: Array<number>;

  // associations
  @BelongsTo(() => CustomerModel, 'realtor_id')
  realtor: CustomerModel;
}
