import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SEND_EMAIL, EMAIL_QUEUE } from '../constants';
import { EmailService } from '../services/email/email.service';

@Processor(EMAIL_QUEUE)
export class EmailQueueProcessor {
  constructor(
    private readonly emailService: EmailService
    ) { }

  @Process(SEND_EMAIL)
  async sendEmail(emailJob: Job) {
    
    this.emailService.sendEmail(emailJob.data);
  }
}
