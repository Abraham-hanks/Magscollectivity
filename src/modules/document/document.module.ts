import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { UtilityModule } from '../utility/utility.module';
import { DocumentController } from './document.controller';
import { DocumentProvider } from './document.provider';
import { DocumentService } from './document.service';

@Module({
  imports: [
    CustomerModule,
    UtilityModule,
  ],
  exports: [DocumentService],
  providers: [
    DocumentService,
    ...DocumentProvider,
  ],
  controllers: [DocumentController]
})
export class DocumentModule {}
