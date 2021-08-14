import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditService } from 'src/modules/utility/services/audit.service';
import { appModules } from '../constants';
import * as requestIp from 'request-ip';
import * as Sentry from '@sentry/node';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    return next
      .handle()
      .pipe(
        map(data => {
          this.createAudit(data, context)
          return data
        })
      );
  }

  private createAudit(data: any, ctx: ExecutionContext) {
    const controllerClass = ctx.getClass()
    const http = ctx.switchToHttp();
    const req = http.getRequest<Request>();

    const reqBody = req.body;

    try {
      if (reqBody['password'])
        delete reqBody['password'];

      if (data['access_token'])
        delete data['access_token'];

      this.auditService.create({
        auth_id: this.getAuthId(req),
        module: appModules[controllerClass.name],
        // request_body: JSON.stringify(reqBody),
        response_body: JSON.stringify(data.payload),
        status_code: data['statusCode'],
        // controller_method: handler.name,
        request_method: req.method,
        response_message: data['message'],
        request_url: req.url,
        user_agent: req.headers['user-agent'],
        ip_address: requestIp.getClientIp(req),
      });
    }
    catch (e) {
      // sentry
      Sentry.captureException(e);
    }
  }

  private getAuthId(req) {
    return req['user'] && !Number.isNaN(req['user']['auth_id']) ? req['user']['auth_id'] : null;
  }
}
