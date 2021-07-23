import { forwardRef, Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletProvider } from './wallet.provider';
import { CustomerModule } from '../customer/customer.module';
import { UtilityModule } from '../utility/utility.module';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    UtilityModule,
  ],
  providers: [
    WalletService,
    ...WalletProvider,
  ],
  controllers: [
    WalletController,
  ],
  exports: [WalletService, ...WalletProvider]
})
export class WalletModule {}
