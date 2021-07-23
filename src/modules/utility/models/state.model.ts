import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';


@Table({
  tableName: 'states',
  timestamps: true,
  paranoid: true
})

export class StateModel extends BaseModel {
  @Column({
    allowNull: false
  })
  name: string;
}
