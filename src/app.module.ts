import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChargeModule } from './modules/charge/charge.module';
import { ChangeRequestModule } from './modules/change-request/change-request.module';
import { CustomerModule } from './modules/customer/customer.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductSubscriptionModule } from './modules/product-subscription/product-sub.module';
import { ProductModule } from './modules/product/product.module';
import { RoleModule } from './modules/role/role.module';
import { TxtnModule } from './modules/txtn/txtn.module';
import { UtilityModule } from './modules/utility/utility.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { DocumentModule } from './modules/document/document.module';


@Module({
  imports: [
    AdminModule,
    AuthModule,
    // ChangeRequestModule,
    // ChargeModule,
    CustomerModule,
    DatabaseModule,
    DocumentModule,
    PaymentModule,
    ProductModule,
    ProductSubscriptionModule,
    RoleModule,
    TxtnModule,
    UtilityModule,
    WalletModule,
  ],
  controllers: [AppController]
})
export class AppModule {}
