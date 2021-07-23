import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AdminModel } from '../admin/admin.model';
import { CustomerModel } from '../customer/models/customer.model';

@Table({
  tableName: 'documents',
  timestamps: true,
  paranoid: true
})

export class DocumentModel extends BaseModel {
  @Column({
    allowNull: false
  })
  name: string;

  @Column
  description: string;

  @Column({
    allowNull: false
  })
  customer_id: number;

  @Column({
    allowNull: false
  })
  created_by_id: number;

  @Column
  updated_by_id: number;

  @Column
  type: string;

  @Column({
    allowNull: false
  })
  url: string;


  // associations
  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  @BelongsTo(() => AdminModel, {
    foreignKey: 'created_by_id',
    as: 'created_by'
  })
  created_by: AdminModel

  @BelongsTo(() => AdminModel, {
    foreignKey: 'updated_by_id',
    as: 'updated_by'
  })
  updated_by: AdminModel
}
