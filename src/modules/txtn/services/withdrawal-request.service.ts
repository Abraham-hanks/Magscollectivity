import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { WithdrawalRequestModel as WithdrawalRequest } from '../models/withdrawal-request.model';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { pagingParser } from 'src/common/utils/paging-parser';
import { APPROVE_WITHDRAWAL_REQUEST, TXTN_CHANNEL, TXTN_POSITION, TXTN_TYPE, WITHDRAWAL_REQUEST_REPOSITORY, WITHDRAWAL_REQUEST_STATUS } from '../constants';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { ApproveWithdrawalRequestDto, CreateWithdrawalRequestDto, DeclineWithdrawalRequestDto } from '../dto/withdrawal-request/withdrawal-request.dto';
import { CustomerModel } from 'src/modules/customer/models/customer.model';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { BasicCustomerAttributeIncludeFields } from 'src/modules/customer/constants';
import { TxtnService } from './txtn.service';
import { AdminModel } from 'src/modules/admin/admin.model';
import { BasicAdminAttributeIncludeFields } from 'src/modules/admin/constants';
import { genRandomXters } from 'src/common/utils/util';
import { CreateTxtnDto } from '../dto/create-txtn.dto';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { BankAccountService } from 'src/modules/payment/services/bank-account.service';


@Injectable()
export class WithdrawalRequestService {
  constructor(
    private readonly bankAccountService: BankAccountService,
    @Inject(WITHDRAWAL_REQUEST_REPOSITORY) private readonly withdrawalRequestRepo: typeof WithdrawalRequest,
    @Inject(forwardRef(() => TxtnService)) private readonly txtnService: TxtnService,
    private readonly walletService: WalletService
  ) { }


  async create(newRequest: CreateWithdrawalRequestDto): Promise<WithdrawalRequest> {

    // check if bank has been added
    await this.bankAccountService.findOne({
      customer_id: newRequest.customer_id
    });

    const wallet = await this.walletService.findOne({
      customer_id: newRequest.customer_id
    });

    if (newRequest.amount > parseInt(wallet.balance))
      throw new BadRequestException(ERROR_MESSAGES.InsufficientWalletBal);

    return this.withdrawalRequestRepo.create(newRequest);
  }


  async findAll(params): Promise<FindAllQueryInterface<WithdrawalRequest>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: DefaultQueryAttributeExclude
      },
      include: [
        {
          model: CustomerModel,
          attributes: BasicCustomerAttributeIncludeFields
        },
        {
          model: AdminModel,
          attributes: BasicAdminAttributeIncludeFields
        }
      ],
      where: {
        ...params.where
      }
    };

    const withdrawalRequests = await this.withdrawalRequestRepo.findAndCountAll(query);
    const paging = pagingParser(query, withdrawalRequests.count, withdrawalRequests.rows.length);

    return {
      paging,
      rows: withdrawalRequests.rows
    };
  }


  async findOne(params, throwNotFoundError = true): Promise<WithdrawalRequest> {

    const withdrawalRequest = await this.withdrawalRequestRepo.findOne({
      where: params,
      attributes: {
        exclude: DefaultQueryAttributeExclude
      },
      include: [
        {
          model: CustomerModel,
          attributes: BasicCustomerAttributeIncludeFields
        },
        {
          model: AdminModel,
          attributes: BasicAdminAttributeIncludeFields
        }
      ],
    });

    if (!withdrawalRequest && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.WithdrawalRequestNotFound);

    return withdrawalRequest;
  }


  async findById(id: number, throwNotFoundError = true): Promise<WithdrawalRequest> {

    const withdrawalRequest = await this.withdrawalRequestRepo.findByPk(id, {
      attributes: {
        exclude: DefaultQueryAttributeExclude
      },
      include: [
        {
          model: CustomerModel,
          attributes: BasicCustomerAttributeIncludeFields
        },
        {
          model: AdminModel,
          attributes: BasicAdminAttributeIncludeFields
        }
      ],
    });

    if (!withdrawalRequest && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.WithdrawalRequestNotFound);

    return withdrawalRequest;
  }

  
  async approve(approveReq: ApproveWithdrawalRequestDto): Promise<boolean> {

    const withdrawalRequest = await this.findById(approveReq.id);

    switch (withdrawalRequest.status) {
      case WITHDRAWAL_REQUEST_STATUS.approved:
        throw new BadRequestException(ERROR_MESSAGES.WithdrawalRequestAlreadyApproved);
    
      case WITHDRAWAL_REQUEST_STATUS.processed:
        throw new BadRequestException(ERROR_MESSAGES.WithdrawalRequestAlreadyProcessed);

      case WITHDRAWAL_REQUEST_STATUS.declined:
        throw new BadRequestException(ERROR_MESSAGES.WithdrawalRequestAlreadyDeclined);
    
      default:
        break;
    }

    // check if customer has sufficient bal
    const wallet = await this.walletService.findOne({
      customer_id: withdrawalRequest.customer_id
    });

    if (parseInt(withdrawalRequest.amount) > parseInt(wallet.balance))
      throw new BadRequestException(ERROR_MESSAGES.InsufficientWalletBal);

    await this.withdrawalRequestRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      withdrawalRequest.status = WITHDRAWAL_REQUEST_STATUS.approved;
      withdrawalRequest.use_paystack = approveReq.use_paystack;
      withdrawalRequest.updated_by_id = approveReq.updated_by_id;

      await withdrawalRequest.save(transactionHost);

      // create txtn and add to queue
      const newTxtn: CreateTxtnDto = {
        channel: TXTN_CHANNEL.wallet,
        type: TXTN_TYPE.withdrawal,
        position: TXTN_POSITION.debit,
        reference: genRandomXters(10, false),
        wallet_id: wallet.id,
        customer_id: withdrawalRequest.customer_id,
        total_amount: parseInt(withdrawalRequest.amount),
        withdrawal_request_id: withdrawalRequest.id
      };

      const createdTxtn = await this.txtnService.create(newTxtn, transactionHost);

      this.txtnService.addtoQueue(APPROVE_WITHDRAWAL_REQUEST, createdTxtn.reference);
    });

    return true;
  }

  async decline(declineReq: DeclineWithdrawalRequestDto): Promise<WithdrawalRequest> {
    const withdrawalRequest = await this.findById(declineReq.id);

    if (withdrawalRequest.status == WITHDRAWAL_REQUEST_STATUS.approved)
      throw new BadRequestException(ERROR_MESSAGES.WithdrawalRequestAlreadyApproved);

    if (withdrawalRequest.status == WITHDRAWAL_REQUEST_STATUS.processed)
      throw new BadRequestException(ERROR_MESSAGES.WithdrawalRequestAlreadyProcessed);

    if (withdrawalRequest.status == WITHDRAWAL_REQUEST_STATUS.declined)
      throw new BadRequestException(ERROR_MESSAGES.WithdrawalRequestAlreadyDeclined);

    withdrawalRequest.status = WITHDRAWAL_REQUEST_STATUS.declined;
    withdrawalRequest.comments = declineReq.comments;
    withdrawalRequest.updated_by_id = declineReq.updated_by_id;
    
    return withdrawalRequest.save();
  }

  async getCount(params): Promise<number> {
    return this.withdrawalRequestRepo.count({
      where: params.where
    });
  }

  async delete(id): Promise<boolean> {
    const withdrawalRequest = await this.findById(id);
    await withdrawalRequest.destroy();

    return true;
  }

}
