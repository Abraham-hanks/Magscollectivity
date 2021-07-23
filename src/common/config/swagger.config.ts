import { DocumentBuilder } from '@nestjs/swagger';
import { configService } from './config.service';

export const swaggerOptions = new DocumentBuilder()
  .setTitle(configService.getAppName())
  .setVersion(configService.getAppVersionNo())
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
  .build();
