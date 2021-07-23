import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminProvider } from './admin.provider';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule), // to resolve circular dependency
  ],
  exports: [AdminService],
  providers: [AdminService, ...AdminProvider],
  controllers: [AdminController]
})
export class AdminModule {}
