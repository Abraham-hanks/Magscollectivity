import { Module } from '@nestjs/common';
import { ChangeRequestService } from './change-request.service';
import { ChangeRequestController } from './change-request.controller';
import { ChangeRequestProvider } from './change-requests.provider';
import { ProductModule } from '../product/product.module';
import { UtilityModule } from '../utility/utility.module';
import { ChargeModule } from '../charge/charge.module';

@Module({
  imports: [
    ChargeModule,
    ProductModule,
    UtilityModule,
  ],
  providers: [
    ChangeRequestService,
    ...ChangeRequestProvider,
  ],
  controllers: [ChangeRequestController],
  exports: [
    ChangeRequestService,
    ...ChangeRequestProvider,
  ]
})
export class ChangeRequestModule {}
