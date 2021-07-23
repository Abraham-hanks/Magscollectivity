import { Controller, Request, Response, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { createHmac } from 'crypto';
import { configService } from 'src/common/config/config.service';
import { TxtnService } from 'src/modules/txtn/services/txtn.service';


@Controller('wbhk')
export class WebhookController {
  constructor(private readonly txtnService: TxtnService) { }

  @Post('pystk')
  @ApiExcludeEndpoint()
  async paystack(
    @Request() req,
    @Response() res
  ) {
    const hash = createHmac('sha512', configService.getPaystackSecretKey()).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {

      res.sendStatus(200);

      const event = req.body;
      // console.log('event: ' + JSON.stringify(event));

      this.txtnService.resolvePystkWebhook(event);
    }
  }

}
