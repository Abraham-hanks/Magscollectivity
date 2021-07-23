import { forwardRef, Module } from '@nestjs/common';
import { PaystackService } from './services/paystack.service';
import { WebhookController } from './controllers/webhook.controller';
import { TxtnModule } from '../txtn/txtn.module';
import { BankAccountController } from './controllers/bank-account.controller';
import { BankAccountService } from './services/bank-account.service';
import { CardAuthService } from './services/card-auth.service';
import { CardAuthController } from './controllers/card-auth.controller';
import { PaymentProvider } from './payment.provider';
import { CustomerModule } from '../customer/customer.module';
import { UtilityModule } from '../utility/utility.module';

@Module({
  imports: [
    // CustomerModule,
    forwardRef(() => CustomerModule),
    forwardRef(() => TxtnModule), // to resolve circular dependency
    UtilityModule
  ],
  controllers: [
    BankAccountController,
    BankAccountController,
    CardAuthController,
    WebhookController
  ],
  providers: [
    BankAccountService,
    CardAuthService,
    PaystackService,
    ...PaymentProvider
  ],
  exports: [
    BankAccountService,
    PaystackService
  ]
})
export class PaymentModule {}
