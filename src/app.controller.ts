import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { configService } from './common/config/config.service';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';


@Controller()
@UseInterceptors(TransformInterceptor)
export class AppController {

  @ApiTags('Index')
  @Get()
  getIndex(): string {
    return `You have reached ${configService.getAppName().toUpperCase()} routes.`;
  }
}
