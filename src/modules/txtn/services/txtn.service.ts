import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindOptions, Op, literal } from 'sequelize';
import { CreateTxtnDto } from '../dto/create-txtn.dto';
import { TxtnModel as Txtn } from '../models/txtn.model';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { pagingParser } from 'src/common/utils/paging-parser';
import { formatTransactionAmount, FUND_REQUEST_PURPOSE, FUND_REQUEST_STATUS, PRODUCT_SUB_PAYMENT_FROM_WALLET, RESOLVE_PYSTK_WEBHOOK, TxtnAttributesExclude, TXTN_CHANNEL, TXTN_POSITION, TXTN_QUEUE, TXTN_REPOSITORY, TXTN_STATUS, TXTN_TYPE, WITHDRAWAL_REQUEST_STATUS } from '../constants';
import { WalletService } from '../../wallet/wallet.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Readable } from 'stream';
import { CustomerService } from '../../customer/services/customer.service';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { FundWalletDto, ProductSubPurchaseDto } from '../dto/new-payment.dto';
import { PaystackService } from '../../payment/services/paystack.service';
import { WalletModel } from '../../wallet/wallet.model';
import { ProductSubscriptionService } from '../../product-subscription/product-sub.service';
import { PRODUCT_SUB_PAYMENT_METHOD, PRODUCT_SUB_STATUS } from '../../product-subscription/constants';
import { configService } from 'src/common/config/config.service';
import { genRandomXters } from 'src/common/utils/util';
import { FundRequestService } from './fund-request.service';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { EmailHelper } from 'src/modules/utility/services/email/email.helper';
import { CustomerModel } from 'src/modules/customer/models/customer.model';
import { WalletAttributesExclude } from 'src/modules/wallet/constants';
import { WithdrawalRequestService } from './withdrawal-request.service';
import { BankAccountService } from 'src/modules/payment/services/bank-account.service';


@Injectable()
export class TxtnService {
  constructor(
    private readonly bankAccountService: BankAccountService,
    @Inject(TXTN_REPOSITORY) private readonly txtnRepo: typeof Txtn,
    @InjectQueue(TXTN_QUEUE) private readonly txtnQueue: Queue,
    @Inject(forwardRef(() => CustomerService)) private readonly customerService: CustomerService,
    @Inject(forwardRef(() => FundRequestService)) private readonly fundRequestService: FundRequestService,
    private readonly paystackService: PaystackService,
    @Inject(forwardRef(() => ProductSubscriptionService)) private readonly productSubService: ProductSubscriptionService,
    private readonly walletService: WalletService,
    private readonly withdrawalRequestService: WithdrawalRequestService,
    private readonly emailHelper: EmailHelper,
  ) { }


  async create(newTxtn: CreateTxtnDto, transactionHost?: any): Promise<Txtn> {

    // prevent duplicate transactions made by error
    // if last txtn in db is same amount and sent 1 minute ago
    if (newTxtn.type != TXTN_TYPE.commission) {
      const existingTxtn = await this.txtnRepo.findOne({
        where: {
          total_amount: newTxtn.total_amount,
          customer_id: newTxtn.customer_id,
          created_at: {
            [Op.gte]: literal("NOW() - (INTERVAL '1 MINUTE')"),
          },
        },
      });

      if (existingTxtn)
        throw new BadRequestException(ERROR_MESSAGES.DuplicateTxtn);
    }

    // send txtn to job queue;
    // this.txtnQueue.add(NEW_TXTN_JOB, newTxtn);
    if (transactionHost)
      return this.txtnRepo.create(newTxtn, transactionHost);

    return this.txtnRepo.create(newTxtn);
  }

  async findAll(params): Promise<FindAllQueryInterface<Txtn>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: TxtnAttributesExclude
      },
      where: {
        ...params.where
      }
    };

    // search
    if (params.search) {
      params.search = '%' + params.search + '%';

      query.where[Op.or] = {
        'type': {
          [Op.iLike]: params.search
        },
        'channel': {
          [Op.iLike]: params.search
        },
        'description': {
          [Op.iLike]: params.search
        },
        'reference': {
          [Op.iLike]: params.search
        },
        // 'total_amount': { // doesn't work on integer
        //   [Op.iLike]: params.search
        // },
        'status': {
          [Op.iLike]: params.search
        },
      }
    }

    const txtns = await this.txtnRepo.findAndCountAll(query);
    const paging = pagingParser(query, txtns.count, txtns.rows.length);

    return {
      paging,
      rows: txtns.rows
    };
  }

  async findOne(params, throwNotFoundError = true): Promise<Txtn> {
    const txtn = await this.txtnRepo.findOne({
      where: params,
      include: [
        {
          model: WalletModel,
          attributes: {
            exclude: WalletAttributesExclude
          }
        },
        {
          model: CustomerModel,
          attributes: {
            exclude: DefaultQueryAttributeExclude,
          },
        }
      ],
      attributes: { exclude: TxtnAttributesExclude }
    });

    if (!txtn && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.TxtnNotFound);

    return txtn;
  }

  async findById(id: number, throwNotFoundError = true): Promise<Txtn> {
    const txtn = await this.txtnRepo.findByPk(id, {

      include: [{
        model: WalletModel,
        attributes: {
          exclude: WalletAttributesExclude
        },
      }],
      attributes: { exclude: TxtnAttributesExclude }
    });

    if (!txtn && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.TxtnNotFound);

    return txtn;
  }

  async getCount(params): Promise<number> {
    return this.txtnRepo.count({
      where: params.where
    });
  }

  // !this isn't same as getCount above
  async getSum(params, columnName: keyof Txtn = 'total_amount'): Promise<number> {

    return this.txtnRepo.sum(columnName, {
      where: params
    });
  }

  getStream(params) {
    let maxPage;
    const query: any = {
      page: 0,
      limit: 100,
      //order: params.order,
      attributes: {
        include: params.include || null,
        exclude: DefaultQueryAttributeExclude
      },
      where: {
        ...params.where
      }
    }

    try {
      const stream = new Readable({
        objectMode: true,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        read() { }
      });

      const readNextChunk = () => {
        query.page++;
        query.skip = (query.page - 1) * query.limit;

        if (query.page > maxPage) {
          stream.push(null);  // close stream
          return;
        }
        return this.txtnRepo.findAll(query)
          .each((item) => {
            item.total_amount = formatTransactionAmount(item.total_amount);
            item.charges = formatTransactionAmount(item.charges);
            item.old_balance = formatTransactionAmount(item.old_balance);
            item.new_balance = formatTransactionAmount(item.new_balance)
            stream.push(item.toJSON())
          })
          .then(() => readNextChunk());
      }

      return this.getCount(query)
        .then((count) => {
          maxPage = (count < query.limit) ? 1 : Math.ceil(count / query.limit);
          return stream;
        })
        .finally(() => readNextChunk())
    }
    catch (err) {
      console.log('err: ' + err);
    }
  }

  addtoQueue(queueName: string, payload: any) {
    return this.txtnQueue.add(queueName, payload);
  }

  // product subscription payment
  async subscriptionPayment(newPurchase: ProductSubPurchaseDto): Promise<any> {

    const customer = await this.customerService.findById(newPurchase.customer_id);
    const { customer_id, status, amount_left } = await this.productSubService.findById(newPurchase.product_sub_id);

    if (customer_id != customer.id)
      throw new BadRequestException(ERROR_MESSAGES.ProductSubIdAndCustomerIdMismatch);

    if (status == PRODUCT_SUB_STATUS.completed)
      throw new BadRequestException(ERROR_MESSAGES.ProductSubAlreadyCompleted);

    if (status == PRODUCT_SUB_STATUS.cancelled)
      throw new BadRequestException(ERROR_MESSAGES.ProductSubCancelled);

    if (newPurchase.amount > parseInt(amount_left))
      newPurchase.amount = parseInt(amount_left);

    // create a pending txtn
    const newTxtn: CreateTxtnDto = {
      product_sub_id: newPurchase.product_sub_id,
      type: TXTN_TYPE.product_subscription,
      customer_id: customer.id,
      total_amount: newPurchase.amount,
      wallet_id: customer.wallet_id
      // charges
    };

    switch (newPurchase.payment_method) {
      case PRODUCT_SUB_PAYMENT_METHOD.wallet:

        const wallet = await this.walletService.findOne({
          customer_id: customer.id
        });

        // pay with wallet
        if (parseInt(wallet.balance) < newPurchase.amount)
          throw new BadRequestException(ERROR_MESSAGES.InsufficientWalletBal);

        newTxtn.reference = genRandomXters(10, true);
        newTxtn.channel = TXTN_CHANNEL.wallet;
        newTxtn.position = TXTN_POSITION.debit;

        await this.create(newTxtn);
        // add the txtn to queue
        this.txtnQueue.add(PRODUCT_SUB_PAYMENT_FROM_WALLET, newTxtn.reference);

        return {
          msg: "Amount will be deducted from Wallet"
        };
      // break;

      case PRODUCT_SUB_PAYMENT_METHOD.paystack:
        // initiate paystack txtn
        const { authorization_url, reference } = await this.paystackService.initialize({
          email: customer.email,
          amount: newPurchase.amount.toString(),
          callback_url: newPurchase.callback_url || configService.getAppUrl()
        });

        newTxtn.reference = reference;
        await this.create(newTxtn);

        return {
          paystackUrl: authorization_url
        };

      case PRODUCT_SUB_PAYMENT_METHOD.fund_request:
        return {
          msg: "Please Proceed to initiate product subscription fund request"
        };

      default:
        break;
    }
  }


  // paystack payment
  async fundWallet(fundTxtn: FundWalletDto): Promise<any> {
    const customer = await this.customerService.findById(fundTxtn.customer_id);

    if (!customer.wallet.is_active)
      throw new BadRequestException(ERROR_MESSAGES.WalletNotActive);

    // initiate paystack txtn
    const { authorization_url, reference } = await (this.paystackService.initialize({
      email: customer.email,
      amount: fundTxtn.amount.toString(),
      callback_url: fundTxtn.callback_url || configService.getAppUrl()
    }));

    // create a pending txtn
    await this.create({
      type: TXTN_TYPE.funding,
      reference,
      wallet_id: customer.wallet_id,
      customer_id: customer.id,
      total_amount: fundTxtn.amount,
      // charges
      position: TXTN_POSITION.credit
    });

    return {
      paystackUrl: authorization_url
    };
  }

  async resolvePystkWebhook(event: any): Promise<any> {
    const txtn = await this.findOne({
      reference: event.data.reference
    });

    if (txtn.status == TXTN_STATUS.success || txtn.status == TXTN_STATUS.failed)
      throw new BadRequestException(ERROR_MESSAGES.TransactionAlreadyCompleted);

    if (event.data.currency !== 'NGN')
      throw new BadRequestException(ERROR_MESSAGES.InvalidCurrency);

    if (event.data.amount != txtn.total_amount)
      throw new BadRequestException(ERROR_MESSAGES.InvalidTxtnAmount);

    // add to queue
    this.txtnQueue.add(RESOLVE_PYSTK_WEBHOOK, event.data);

    return true;
  }



  /*
          !!! 
    TRANSACTION QUEUE PROCESSOR
    this is used for JOB processing and shouldn't be called by controller
    should only called from the queue processor
  */

  async processPystkWebhook(eventData: any): Promise<boolean> {

    const txtn = await this.findOne({
      reference: eventData.reference
    });

    await this.txtnRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      // update txtn details
      txtn.channel = eventData.channel;
      txtn.status = eventData.status;
      txtn.charges = eventData.fees;

      // save authorization if card was used


      if (eventData.status === "success") {

        switch (txtn.type) {

          case TXTN_TYPE.funding:
            // credit customer's wallet
            const creditWalletRes = await this.walletService.credit(txtn.wallet_id, parseInt(txtn.total_amount), transactionHost);

            txtn.old_balance = creditWalletRes.oldBal;
            txtn.new_balance = creditWalletRes.newBal;
            await txtn.save(transactionHost);
            this.emailHelper.transactionNotification(txtn, txtn.customer);

            break;

          case TXTN_TYPE.product_subscription:

            await this.productSubService.productSubPaymentSuccess(txtn.product_sub_id, txtn.total_amount, transactionHost);
            await txtn.save(transactionHost);
            // this.emailHelper.transactionNotification(txtn);

            break;

          case TXTN_TYPE.charge_payment:

            break;

          case TXTN_TYPE.withdrawal:

            const debitWalletRes = await this.walletService.debit(txtn.wallet_id, parseInt(txtn.total_amount), transactionHost);

            // update txtn
            txtn.old_balance = debitWalletRes.oldBal;
            txtn.new_balance = debitWalletRes.newBal;

            txtn.status = TXTN_STATUS.success;
            await txtn.save(transactionHost);

            const withdrawalReq = await this.withdrawalRequestService.findById(txtn.withdrawal_request_id);

            withdrawalReq.status = WITHDRAWAL_REQUEST_STATUS.processed;
            await withdrawalReq.save(transactionHost);

            this.emailHelper.transactionNotification(txtn, txtn.customer);

            break;

          default:
            // Invalid Txtn type OR not captured
            console.log('txtn.type: ' + txtn.type);
            break;
        }
      }
    });

    return true;
  }

  async processProductSubPaymentFromWallet(reference: string): Promise<boolean> {

    const txtn = await this.findOne({
      reference
    });

    await this.txtnRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      const { oldBal, newBal } = await this.walletService.debit(txtn.wallet_id, parseInt(txtn.total_amount), transactionHost);

      // update txtn
      txtn.old_balance = oldBal;
      txtn.new_balance = newBal;
      txtn.status = TXTN_STATUS.success;

      await txtn.save(transactionHost);
      this.emailHelper.transactionNotification(txtn, txtn.customer);
      await this.productSubService.productSubPaymentSuccess(txtn.product_sub_id, txtn.total_amount, transactionHost);
    });

    return true;
  }

  async processApproveFundRequest(reference: string): Promise<boolean> {

    const txtn = await this.findOne({
      reference
    });
    const fundRequest = await this.fundRequestService.findById(txtn.fund_request_id);

    if (fundRequest.status == FUND_REQUEST_STATUS.approved)
      return true;

    await this.txtnRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      if (fundRequest.purpose == FUND_REQUEST_PURPOSE.wallet_funding) {

        const { oldBal, newBal } = await this.walletService.credit(txtn.wallet_id, parseInt(txtn.total_amount), transactionHost);

        // update txtn
        txtn.old_balance = oldBal;
        txtn.new_balance = newBal;

        txtn.status = TXTN_STATUS.success;
        await txtn.save(transactionHost);

        fundRequest.status = FUND_REQUEST_STATUS.approved;
        await fundRequest.save(transactionHost);

        this.emailHelper.transactionNotification(txtn, txtn.customer);
      }

      // if product_sub_payment
      else if (fundRequest.purpose == FUND_REQUEST_PURPOSE.product_sub_payment) {
        txtn.status = TXTN_STATUS.success;
        await txtn.save(transactionHost);

        fundRequest.status = FUND_REQUEST_STATUS.approved;
        await fundRequest.save(transactionHost);

        await this.productSubService.productSubPaymentSuccess(txtn.product_sub_id, txtn.total_amount, transactionHost);
      }

    });

    return true;
  }

  async processApproveWithdrawalRequest(reference: string): Promise<boolean> {

    const txtn = await this.findOne({
      reference
    });
    const withdrawalReq = await this.withdrawalRequestService.findById(txtn.withdrawal_request_id);

    if (withdrawalReq.status == WITHDRAWAL_REQUEST_STATUS.processed)
      return true;

    await this.txtnRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      // process paystack payout
      if (withdrawalReq.use_paystack) {

        // get receipient
        const { recipient_code } = await this.bankAccountService.findOne({
          customer_id: withdrawalReq.customer_id
        });

        await this.paystackService.transferFunds({
          source: 'balance',
          reason: 'withdrawal',
          amount: parseInt(txtn.total_amount),
          recipient: recipient_code,
          reference: txtn.reference
        });

        // wait for webhook before debiting wallet
        return true;
      }

      // if not paystack
      const { oldBal, newBal } = await this.walletService.debit(txtn.wallet_id, parseInt(txtn.total_amount), transactionHost);

      // update txtn
      txtn.old_balance = oldBal;
      txtn.new_balance = newBal;

      txtn.status = TXTN_STATUS.success;
      await txtn.save(transactionHost);

      withdrawalReq.status = WITHDRAWAL_REQUEST_STATUS.processed;
      await withdrawalReq.save(transactionHost);

      this.emailHelper.transactionNotification(txtn, txtn.customer);
    });

    return true;
  }
}
