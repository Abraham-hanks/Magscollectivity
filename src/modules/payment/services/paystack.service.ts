import { BadRequestException, Injectable } from '@nestjs/common';
import { configService } from 'src/common/config/config.service';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { NewReceipient, PaystackFundsTransfer, PaystackInitiate } from '../constants';
import { VerifyBankDto } from '../dto/bank-account/verify-bank.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const paystack = require("paystack-api")(configService.getPaystackSecretKey());


@Injectable()
export class PaystackService {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) { }

  // private paystack = paystackk(configService.getPaystackSecretKey());

  async initialize(newTxtn: PaystackInitiate): Promise<any> {

    try {
      const res = await paystack.transaction.initialize(newTxtn);
      if (res.status === true)
        return res.data;

      // sentry(resp.data.message)
      throw new BadRequestException(ERROR_MESSAGES.PaystackTxtnInitiateError);
    }
    catch (error) {
      // sentry(error)
      throw error;
    }
  }

  async verifyBankAccount(bankAcc: VerifyBankDto): Promise<any> {
    try {
      const res = await paystack.verification.resolveAccount(bankAcc);
      if (res.status === true)
        return res.data;

      throw new BadRequestException(ERROR_MESSAGES.PaystackBankVerificationError);
    }
    catch (error) {
      
      throw new BadRequestException(ERROR_MESSAGES.PaystackBankVerificationError);
    }
  }

  async createTransferReceipient(newReceipient: NewReceipient): Promise<any> {
    newReceipient.type = 'nuban';
    newReceipient.currency = 'NGN';

    try {
      const res = await paystack.transfer_recipient.create(newReceipient);

      if (res.status === true)
        return res.data;

      // sentry(resp.data.message)
      throw new BadRequestException(ERROR_MESSAGES.PaystackCreateReceipientError);
    }
    catch (error) {
      console.log('error: ' + error);
      // sentry(error)
      throw error;
    }
  }

  // withdrawl uses this function
  async transferFunds(newTransfer: PaystackFundsTransfer): Promise<any> {
    console.log('newTransfer: ' + JSON.stringify(newTransfer));
    try {
      const res = await paystack.transfer.create(newTransfer);

      if (res.status === true)
        return res.data;

      throw new BadRequestException(ERROR_MESSAGES.FundsTransferError);
    }
    catch (error) {
      console.log('error: ' + error);
      // sentry(error)
      throw error;
    }
  }

  async listBanks(): Promise<any> {
    return (await paystack.misc.list_banks()).data;
  }

  async verifiyTxtn(reference: string) {
    return paystack.transaction.verify(reference);
  }
}
