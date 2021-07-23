import { HttpModule, Module } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { UtilityProvider } from './utility.providers';
import { AuditService } from './services/audit.service';
import { StateService } from './services/state.service';
import { StateController } from './controllers/state.controller';
import { LgaController } from './controllers/lga.controller';
import { LgaService } from './services/lga.service';
import { BullModule } from '@nestjs/bull';
import { configService } from 'src/common/config/config.service';
import { EMAIL_QUEUE } from './constants';
import { EmailHelper } from './services/email/email.helper';
import { EmailService } from './services/email/email.service';
import { EmailQueueProcessor } from './queue/email.queue';
import { AuditController } from './controllers/audit.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
      redis: configService.getRedisUrl(),
    }),
    HttpModule,
  ],
  controllers: [
    AuditController,
    LgaController,
    StateController,
  ],
  providers: [
    AuditService,
    EmailHelper,
    EmailService,
    EmailQueueProcessor,
    LgaService,
    StateService,
    TokenService,
    ...UtilityProvider
  ],
  exports: [
    AuditService,
    EmailHelper,
    EmailService,
    LgaService,
    StateService,
    TokenService,
  ]
})
export class UtilityModule {}
