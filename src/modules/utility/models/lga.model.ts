import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { StateModel } from './state.model';

@Table({
  tableName: 'lgas',
  timestamps: true,
  paranoid: true
})

export class LgaModel extends BaseModel {
  @Column({
    allowNull: false
  })
  name: string;

  @Column({
    allowNull: false
  })
  state_id: number;

  // associations
  @BelongsTo(() => StateModel, 'state_id')
  state: StateModel;
}
