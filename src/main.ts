import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configService } from './common/config/config.service';
import { swaggerOptions } from './common/config/swagger.config';
import * as Sentry from '@sentry/node';
import { AllExceptionsFilter } from './common/exception/http-exception.filter';

const port = configService.getPort();
const apiPrefix = configService.getApiPrefix();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  });

  // sentry
  // if(!configService.isDev) {
  //   Sentry.init({
  //     dsn: configService.getSentryDsn(),
  //     tracesSampleRate: 1.0,
  //     environment: configService.nodeEnv,
  //   });
  //   const scope = new Sentry.Scope();
  //   scope.setTag('ENV', configService.nodeEnv);
  // }

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix(apiPrefix);
  app.enableCors();

  // Swagger docs configuration
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);


  await app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
}
bootstrap();
