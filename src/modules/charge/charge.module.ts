import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { ChargeController } from './controllers/charge.controller';
import { ChargeProvider } from './charge.provider';
import { ChargeSubscriptionService } from './services/charge-subscription.service';
import { ChargeService } from './services/charge.service';
import { UtilityModule } from '../utility/utility.module';

@Module({
  imports: [
    CustomerModule,
    ProductModule,
    UtilityModule
  ],
  controllers: [
    ChargeController,
    // ChargeSubscriptionController
  ],
  providers: [
    ChargeService,
    ChargeSubscriptionService,
    ...ChargeProvider,
  ],
  exports: [
    ChargeService,
    ChargeSubscriptionService,
  ]
})
export class ChargeModule { }
