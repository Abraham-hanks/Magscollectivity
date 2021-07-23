import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleProvider } from './role.provider';
import { UtilityModule } from '../utility/utility.module';

@Module({
  imports: [
    UtilityModule
  ],
  providers: [RoleService, ...RoleProvider],
  controllers: [RoleController],
  exports: [RoleService]
})
export class RoleModule {}
