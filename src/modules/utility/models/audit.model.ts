import { BelongsTo, Column, Table } from "sequelize-typescript";
import { BaseModel } from "src/database/models/base.model";
import { AuthModel } from "src/modules/auth/auth.model";

@Table({
  tableName: 'audits',
  timestamps: true,
  paranoid: true
})
export class AuditModel extends BaseModel {

  @Column
  label: string;

  @Column({
  })
  auth_id: number;

  @Column({
  })
  module: string;

  @Column({
  })
  request_body: string;

  @Column({
  })
  response_body: string;

  @Column({
  })
  response_message: string;

  @Column({
    // allowNull: false
  })
  status_code: number;

  @Column
  controller_method: string;

  @Column({
    // allowNull: false
  })
  request_method: string;

  @Column({
    // allowNull: false
  })
  request_url: string;

  @Column
  user_agent: string;

  @Column
  ip_address: string;

  // associations

  @BelongsTo(() => AuthModel, 'auth_id')
  user: AuthModel;
}
