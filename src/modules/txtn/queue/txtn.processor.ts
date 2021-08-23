import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as Sentry from '@sentry/node';
import { APPROVE_FUND_REQUEST, APPROVE_WITHDRAWAL_REQUEST, PRODUCT_SUB_PAYMENT_FROM_WALLET, RESOLVE_PYSTK_WEBHOOK, TXTN_QUEUE } from '../constants';
import { TxtnService } from '../services/txtn.service';
import { configService } from 'src/common/config/config.service';

@Processor(TXTN_QUEUE)
export class TxtnProcessor {
  constructor(
    private readonly txtnService: TxtnService
  ) { }

  // @Process(NEW_TXTN_JOB)
  // async processTxtn(txtnJob: Job) {

  //   // await this.txtnService.processNewTxtnJob(txtnJob.data);
  // }

  @Process(RESOLVE_PYSTK_WEBHOOK)
  async resolvePystkWebhook(txtnJob: Job) {
    // add configurations to the job
    try {
      await this.txtnService.processPystkWebhook(txtnJob.data);
    }
    catch (e) {
      // retry transaction

      if (!configService.isDev) {
        const scope = new Sentry.Scope();
        scope.setTag('txtn_queue', RESOLVE_PYSTK_WEBHOOK);
        Sentry.captureException(e);
      }

      else
        console.log('e: ' + e);
    }
  }

  @Process(PRODUCT_SUB_PAYMENT_FROM_WALLET)
  async processProductSubPaymentFromWallet(txtnJob: Job) {
    // add configurations to the job

    try {
      await this.txtnService.processProductSubPaymentFromWallet(txtnJob.data);
    }
    catch (e) {
      // retry transaction

      if (!configService.isDev) {
        const scope = new Sentry.Scope();
        scope.setTag('txtn_queue', PRODUCT_SUB_PAYMENT_FROM_WALLET);
        Sentry.captureException(e);
      }

      else
        console.log('e: ' + e);
    }
  }

  // fund_request
  @Process(APPROVE_FUND_REQUEST)
  async processApproveFundRequest(txtnJob: Job) {
    // add configurations to the job
    try {
      await this.txtnService.processApproveFundRequest(txtnJob.data);
    }
    catch (e) {
      // retry transaction
      if (!configService.isDev) {
        const scope = new Sentry.Scope();
        scope.setTag('txtn_queue', APPROVE_FUND_REQUEST);
        Sentry.captureException(e);
      }

      else
        console.log('e: ' + e);
    }
  }

  // withdrawal_request
  @Process(APPROVE_WITHDRAWAL_REQUEST)
  async processApproveWithdrawalRequest(txtnJob: Job) {
    // add configurations to the job
    try {
      await this.txtnService.processApproveWithdrawalRequest(txtnJob.data);
    }
    catch (e) {
      // retry transaction
      if (!configService.isDev) {
        const scope = new Sentry.Scope();
        scope.setTag('txtn_queue', APPROVE_WITHDRAWAL_REQUEST);
        Sentry.captureException(e);
      }

      else
        console.log('e: ' + e);
    }
  }
}
