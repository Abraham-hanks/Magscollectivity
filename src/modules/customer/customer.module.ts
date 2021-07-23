import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { CustomerProvider } from './customer.provider';
import { AuthModule } from '../auth/auth.module';
import { WalletModule } from '../wallet/wallet.module';
import { UtilityModule } from '../utility/utility.module';
import { RealtorTreeService } from './services/realtor-tree.service';
import { TxtnModule } from '../txtn/txtn.module';
import { ProductSubscriptionModule } from '../product-subscription/product-sub.module';

@Module({
  // imports: [AuthModule],
  imports: [
    forwardRef(() => AuthModule), // to resolve circular dependency
    ProductSubscriptionModule,
    forwardRef(() => TxtnModule),
    UtilityModule,
    WalletModule,
  ],
  controllers: [
    CustomerController,
  ],
  providers: [
    CustomerService, 
    ...CustomerProvider,
    RealtorTreeService
  ],
  exports: [
    CustomerService,
    RealtorTreeService
  ],
})
export class CustomerModule {}
