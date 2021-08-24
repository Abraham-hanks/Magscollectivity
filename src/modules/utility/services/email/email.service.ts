import { HttpService, Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { configService } from 'src/common/config/config.service';
import { WEB_APP_LOGIN_LINK_PREFIX } from 'src/modules/auth/constants';
import { EmailObj } from '../../constants';
// import sentry from './sentry';

@Injectable()
export class EmailService {
	constructor(
		private readonly httpService: HttpService
	) { }

	private isProduction = configService.isProduction;
	private APP_URL = configService.getAppUrl();

	async sendEmail(email: EmailObj) {

		email.subject = this.isProduction ? email.subject : `TEST - ${email.subject}`;
		email.from = email.from || 'magscollectivitywebapp@gmail.com';
		
		const merge = {
			...email.templatePayload,
      "year": new Date().getFullYear(),
      "login_url": WEB_APP_LOGIN_LINK_PREFIX,
      "live_chat_url": this.APP_URL,
      "help_url": this.APP_URL,
      "support_url": this.APP_URL,
      "action_url": this.APP_URL,
      "office_address": "17 Freedom Way, 3rd Roundabout, Lekki Phase 1, Lagos State, Nigeria",
      "phone": "08038028522",
      "business_name": "Magscollectivity",
      "support_mail": "magscollectivity@gmail.com",
      "business_type": "LLC",
    };

		const content = {
			"Merge": merge,
			"From": email.from,
			"ReplyTo": email.from,
			"Subject": email.subject,
			"TemplateName": email.templateName,
		};

		const receipients = [
			{
				"Email": email.to,
			}
		];

		if (!configService.isProduction)
			receipients.push({ "Email": "magscollectivitywebapp@gmail.com" })

		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			"X-ElasticEmail-ApiKey": configService.getElasticeAPIKey()
		}

		// only send mails in staging and production
		if (!configService.isDev) {
			try {
				const res = await this.httpService.post(
					'https://api.elasticemail.com/v4/emails',
					{
						"Content": content,
						"Recipients": receipients,
					},
					{
						headers: headers
					}
				).toPromise();

			}
			catch (e) {
				// log to sentry
				// if (!configService.isDev) {
				// 	const scope = new Sentry.Scope();
				// 	scope.setTag('section', 'send email');
				// 	Sentry.captureException(e);
				// }

				// else
					console.log('e: ' + e);
			};
		}
	}
}
