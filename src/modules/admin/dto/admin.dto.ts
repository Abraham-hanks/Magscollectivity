import { ApiHideProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateAuthDto } from 'src/modules/auth/dto/create-auth.dto';
import { ADMIN_TYPES } from '../constants';

// admin and auth dto
export class CreateAdminDto extends OmitType(CreateAuthDto,
  [
    'phone',
  ] as const) {

  @IsOptional()
  @ApiHideProperty()
  auth_id?: number;

  @IsEnum(Object.values(ADMIN_TYPES))
  @ApiHideProperty()
  @IsOptional()
  type?= ADMIN_TYPES.admin;

  @IsOptional()
  @ApiHideProperty()
  is_active = true;

  //for swagger docs
  @IsOptional()
  role_id: number;
}

export class updateAdminDto extends PartialType(PickType(CreateAdminDto,
  [
    'email', 
    'password',  
    'role_id'
  ] as const)) {
}
