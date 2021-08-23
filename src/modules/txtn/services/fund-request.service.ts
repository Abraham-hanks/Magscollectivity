import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { FundRequestModel as FundRequest } from '../models/fund-request.model';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { pagingParser } from 'src/common/utils/paging-parser';
import { APPROVE_FUND_REQUEST, FUND_REQUEST_PURPOSE, FUND_REQUEST_REPOSITORY, FUND_REQUEST_STATUS, TXTN_CHANNEL, TXTN_POSITION, TXTN_TYPE } from '../constants';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { ApproveFundRequestDto, CreateFundRequestDto, DeclineFundRequestDto } from '../dto/fund-request/fund-request.dto';
import { CustomerModel } from 'src/modules/customer/models/customer.model';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { BasicCustomerAttributeIncludeFields } from 'src/modules/customer/constants';
import { TxtnService } from './txtn.service';
import { AdminModel } from 'src/modules/admin/admin.model';
import { BasicAdminAttributeIncludeFields } from 'src/modules/admin/constants';
import { genRandomXters } from 'src/common/utils/util';
import { CreateTxtnDto } from '../dto/create-txtn.dto';
import { ProductSubscriptionService } from 'src/modules/product-subscription/product-sub.service';
import { PRODUCT_SUB_STATUS } from 'src/modules/product-subscription/constants';


@Injectable()
export class FundRequestService {
  constructor(
    @Inject(FUND_REQUEST_REPOSITORY) private readonly fundRequestRepo: typeof FundRequest,
    @Inject(forwardRef(() => ProductSubscriptionService)) private readonly productSubService: ProductSubscriptionService,
    @Inject(forwardRef(() => TxtnService)) private readonly txtnService: TxtnService
  ) { }


  async create(newFundRequest: CreateFundRequestDto): Promise<FundRequest> {

    if (newFundRequest.purpose == FUND_REQUEST_PURPOSE.product_sub_payment) {
     const productSub = await this.productSubService.findById(newFundRequest.product_sub_id);

     if (productSub.status == PRODUCT_SUB_STATUS.completed)
      throw new BadRequestException(ERROR_MESSAGES.ProductSubAlreadyCompleted);

    }

    return this.fundRequestRepo.create(newFundRequest);
  }

  async findAll(params): Promise<FindAllQueryInterface<FundRequest>> {
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

    const fundRequests = await this.fundRequestRepo.findAndCountAll(query);
    const paging = pagingParser(query, fundRequests.count, fundRequests.rows.length);

    return {
      paging,
      rows: fundRequests.rows
    };
  }

  async findOne(params, throwNotFoundError = true): Promise<FundRequest> {
    const fundRequest = await this.fundRequestRepo.findOne({
      where: {
        ...params
      },
      attributes: {
        exclude: DefaultQueryAttributeExclude
      },
      include: [
        {
          model: CustomerModel,
          attributes: ['wallet_id', ...BasicCustomerAttributeIncludeFields]
        },
        {
          model: AdminModel,
          attributes: BasicAdminAttributeIncludeFields
        }
      ],
    });

    if (!fundRequest && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.FundRequestNotFound);

    return fundRequest;
  }

  async findById(id: number, throwNotFoundError = true): Promise<FundRequest> {
    const fundRequest = await this.fundRequestRepo.findByPk(id, {
      attributes: {
        exclude: DefaultQueryAttributeExclude
      },
      include: [
        {
          model: CustomerModel,
          attributes: [ 'wallet_id', ...BasicCustomerAttributeIncludeFields ]
        },
        {
          model: AdminModel,
          attributes: BasicAdminAttributeIncludeFields
        }
      ],
    });

    if (!fundRequest && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.FundRequestNotFound);

    return fundRequest;
  }

  async approve(approveReq: ApproveFundRequestDto): Promise<boolean> {

    const fundRequest = await this.findById(approveReq.id);

    if (fundRequest.status == FUND_REQUEST_STATUS.approved)
      throw new BadRequestException(ERROR_MESSAGES.FundRequestAlreadyApproved);
      
    if (fundRequest.status == FUND_REQUEST_STATUS.declined)
      throw new BadRequestException(ERROR_MESSAGES.FundRequestAlreadyDeclined);

    await this.fundRequestRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      fundRequest.updated_by_id = approveReq.updated_by_id;
      await fundRequest.save(transactionHost);

      // create txtn and add to queue
      const newTxtn: CreateTxtnDto = {
        channel: TXTN_CHANNEL.fund_request,
        reference: fundRequest.bank_reference || genRandomXters(10, true),
        wallet_id: fundRequest.customer.wallet_id,
        customer_id: fundRequest.customer_id,
        total_amount: parseInt(fundRequest.amount),
        fund_request_id: fundRequest.id
      };

      if (fundRequest.purpose == FUND_REQUEST_PURPOSE.wallet_funding) {
        newTxtn.type = TXTN_TYPE.funding;
        newTxtn.position = TXTN_POSITION.credit;
      }

      else if (fundRequest.purpose == FUND_REQUEST_PURPOSE.product_sub_payment) {
        newTxtn.type = TXTN_TYPE.product_subscription;
        newTxtn.position = null;
        newTxtn.product_sub_id = fundRequest.product_sub_id;

        const productSub = await this.productSubService.findById(fundRequest.product_sub_id);
       
        if (!approveReq.ignore_amount_difference && parseInt(fundRequest.amount) > parseInt(productSub.amount_left))
          throw new BadRequestException(ERROR_MESSAGES.PaymentAmountNotEqualToProductSubscriptionAmountLeft);

      }

      const createdTxtn = await this.txtnService.create(newTxtn, transactionHost);

      this.txtnService.addtoQueue(APPROVE_FUND_REQUEST, createdTxtn.reference);
    });

    return true;
  }

  async decline(declineReq: DeclineFundRequestDto): Promise<FundRequest> {
    const fundRequest = await this.findById(declineReq.id);

    if (fundRequest.status == FUND_REQUEST_STATUS.approved)
      throw new BadRequestException(ERROR_MESSAGES.FundRequestAlreadyApproved);

    if (fundRequest.status == FUND_REQUEST_STATUS.declined)
      throw new BadRequestException(ERROR_MESSAGES.FundRequestAlreadyDeclined);

    fundRequest.status = FUND_REQUEST_STATUS.declined;
    fundRequest.comments = declineReq.comments;
    fundRequest.updated_by_id = declineReq.updated_by_id;
    
    return fundRequest.save();
  }

  async getCount(params): Promise<number> {
    return this.fundRequestRepo.count({
      where: params.where
    });
  }

  async delete(id): Promise<boolean> {
    const fundRequest = await this.findById(id);
    await fundRequest.destroy();

    return true;
  }

}
