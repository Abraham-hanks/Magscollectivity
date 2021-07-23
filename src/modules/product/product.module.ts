import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductProvider } from './product.provider';
import { UtilityModule } from '../utility/utility.module';
import { PaymentPlanController } from './controllers/payment-plan.controller';
import { PaymentPlanService } from './services/payment-plan.service';

@Module({
  imports: [
    UtilityModule
  ],
  controllers: [
    PaymentPlanController,
    ProductController
  ],
  providers: [
    PaymentPlanService,
    ProductService,
    ...ProductProvider
  ],
  exports: [ProductService, PaymentPlanService],
})
export class ProductModule { }
