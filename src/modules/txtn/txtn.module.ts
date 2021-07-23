import { forwardRef, Module } from '@nestjs/common';
import { TxtnController } from './controllers/txtn.controller';
import { TxtnService } from './services/txtn.service';
import { TxtnProvider } from './txtn.provider';
import { BullModule } from '@nestjs/bull';
import { WalletModule } from '../wallet/wallet.module';
import { TxtnProcessor } from './queue/txtn.processor';
import { CustomerModule } from '../customer/customer.module';
import { configService } from 'src/common/config/config.service';
import { TXTN_QUEUE } from './constants';
import { PaymentModule } from '../payment/payment.module';
import { ProductSubscriptionModule } from '../product-subscription/product-sub.module';
import { FundRequestService } from './services/fund-request.service';
import { FundRequestController } from './controllers/fund-request.controller';
import { UtilityModule } from '../utility/utility.module';
import { WithdrawalRequestService } from './services/withdrawal-request.service';
import { WithdrawalRequestController } from './controllers/withdrawal-request.controller';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => ProductSubscriptionModule),
    WalletModule,
    // forwardRef(() => UtilityModule),
    BullModule.registerQueue({
      name: TXTN_QUEUE,
      redis: configService.getRedisUrl(),
    }),
    UtilityModule,
  ],
  providers: [
    FundRequestService,
    TxtnService,
    ...TxtnProvider, 
    TxtnProcessor,
    WithdrawalRequestService
  ],
  controllers: [
    FundRequestController,
    TxtnController,
    WithdrawalRequestController
  ],
  exports: [
    TxtnService
  ]
})
export class TxtnModule {}
