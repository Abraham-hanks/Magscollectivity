import { forwardRef, Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { TxtnModule } from '../txtn/txtn.module';
import { UtilityModule } from '../utility/utility.module';
import { ProductSubController } from './product-sub.controller';
import { ProductSubProvider } from './product-sub.provider';
import { ProductSubscriptionService } from './product-sub.service';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    ProductModule,
    forwardRef(() => TxtnModule),
    UtilityModule,
  ],
  exports: [ProductSubscriptionService],
  providers: [ProductSubscriptionService, ...ProductSubProvider],
  controllers: [ProductSubController]
})
export class ProductSubscriptionModule {}
