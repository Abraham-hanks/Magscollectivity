/* eslint-disable prefer-const */
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { CUSTOMER_COMMISSION, DefaultQueryAttributeExclude, PRODUCT_PAYMENT, REALTOR_COMMISSION, WITHHOLDINGTAX } from 'src/common/constants';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { pagingParser } from 'src/common/utils/paging-parser';
import { genRandomXters } from 'src/common/utils/util';
import { PRODUCT_SUB_STATUS } from 'src/modules/product-subscription/constants';
import { ProductSubscriptionService } from 'src/modules/product-subscription/product-sub.service';
import { TXTN_CHANNEL, TXTN_POSITION, TXTN_STATUS, TXTN_TYPE } from 'src/modules/txtn/constants';
import { TxtnService } from 'src/modules/txtn/services/txtn.service';
import { ADMIN_WALLETS } from 'src/modules/wallet/constants';
import { WalletService } from 'src/modules/wallet/wallet.service';
//import * as Sentry from '@sentry/node';
import { CommissionPmt, CreateRealtorTree, CustomerAttributeIncludeFields, REALTOR_STAGE, REALTOR_TREE_REPOSITORY } from '../constants';
import { CustomerModel as Customer, CustomerModel } from '../models/customer.model';
import { RealtorTreeModel as RealtorTree } from '../models/realtor-tree.model';
import { CustomerService } from './customer.service';
import { EmailHelper } from 'src/modules/utility/services/email/email.helper';

@Injectable()
export class RealtorTreeService {
  constructor(
    @Inject(REALTOR_TREE_REPOSITORY) private readonly realtorTreeRepo: typeof RealtorTree,
    // private readonly customerService: CustomerService,
    @Inject(forwardRef(() => CustomerService)) private readonly customerService: CustomerService,
    private readonly productSubService: ProductSubscriptionService,
    private readonly txtnService: TxtnService,
    private readonly walletService: WalletService,
    private readonly emailHelper: EmailHelper,
  ) { }

  async addReferrer(newUser: Customer, transactionHost): Promise<boolean> {

    // create a new realtorTree tree for newly registered realtor
    if (newUser.is_realtor) {
      await this.create({
        realtor_id: newUser.id
      }, transactionHost);
    }

    // update realtor's tree if new user used referral code
    if (newUser.referred_by_id) {
      let realtorTree = await this.findOne({
        "realtor_id": newUser.referred_by_id
      }, false);

      if (!realtorTree) {
        realtorTree = await this.create({
          realtor_id: newUser.referred_by_id,
          for_realtor: false,
        }, transactionHost);
      }

      if (newUser.is_realtor && realtorTree.for_realtor) {
        const downline = realtorTree.downline;
        downline.push(newUser.id);
        realtorTree.downline = downline;

        // await this.checkRequirements(realtorTree.realtor_id, transactionHost)
      }

      else
        realtorTree.no_customers_referred++;

      await realtorTree.save(transactionHost);
      if (realtorTree.for_realtor)
        this.emailHelper.referralNotification(realtorTree.realtor, newUser.firstname)
    }
    return true;
  }


  private async create(newRealtorTree: CreateRealtorTree, transactionHost): Promise<RealtorTree> {

    return this.realtorTreeRepo.create(newRealtorTree, transactionHost);
  }

  async findAll(params): Promise<FindAllQueryInterface<RealtorTree>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: DefaultQueryAttributeExclude
      },
      where: {
        ...params.where
      }
    };

    const realtorTrees = await this.realtorTreeRepo.findAndCountAll(query);
    const paging = pagingParser(query, realtorTrees.count, realtorTrees.rows.length);

    return {
      paging,
      rows: realtorTrees.rows
    };
  }

  async findById(id: number, throwNotFoundError = true): Promise<RealtorTree> {
    const realtorTree = await this.realtorTreeRepo.findByPk(id,
      {
        attributes: {
          exclude: DefaultQueryAttributeExclude,
        },
        include: [
          {
            model: CustomerModel,
            as: 'realtor',
            attributes: CustomerAttributeIncludeFields
          }
        ]
      }
    );
    if (!realtorTree && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.RealtorTreeNotFound);

    return realtorTree;
  }

  async findOne(params, throwNotFoundError = true): Promise<RealtorTree> {
    const realtorTree = await this.realtorTreeRepo.findOne(
      {
        where: params,
        attributes: {
          exclude: DefaultQueryAttributeExclude,
        },
        include: [
          {
            model: CustomerModel,
            as: 'realtor',
            attributes: CustomerAttributeIncludeFields
          }
        ]
      });

    if (!realtorTree && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.RealtorTreeNotFound);

    return realtorTree;
  }

  async getCount(params): Promise<number> {
    const count = await this.realtorTreeRepo.count({
      where: params.where
    });
    return count;
  }


  async upgradeRealtorStage(customer_id: number, transactionHost): Promise<RealtorTree | any> {

    const { referred_by_id } = await this.customerService.findById(customer_id);

    // customer has no upline
    if (!referred_by_id)
      return;
      
    const realtor = await this.customerService.findById(referred_by_id);
    const realtor_id = realtor.id;

    if (realtor.realtor_stage == REALTOR_STAGE.diamond)
      return true;

    const { completed_sales, downline_count } = await this.findOne({
      realtor_id
    });

    switch (realtor.realtor_stage) {

      case REALTOR_STAGE.inactive_ambassador:
        if (completed_sales >= 0)
          realtor.realtor_stage = REALTOR_STAGE.ambassador;
        break;

      case REALTOR_STAGE.ambassador:
        // gold - Sold 10 plots OR 20 Ambassadors(minimum 5 Active)

        const activeAmbassadorCount = await this.customerService.getCount({
          where: {
            referred_by_id: realtor_id,
            is_realtor: true,
            realtor_stage: REALTOR_STAGE.ambassador,
          }
        });

        // console.log('activeAmbassadorCount: ' + activeAmbassadorCount);

        if (completed_sales >= 10 || (downline_count >= 20 && activeAmbassadorCount >= 5))
          realtor.realtor_stage = REALTOR_STAGE.gold;
        break;

      case REALTOR_STAGE.gold:
        // diamond - 100 downline(minimum 20 gold ambassadors)

        const goldAmbassadorCount = await this.customerService.getCount({
          where: {
            referred_by_id: realtor_id,
            is_realtor: true,
            realtor_stage: REALTOR_STAGE.gold,
          }
        });

        if (downline_count >= 100 && goldAmbassadorCount >= 20)
          realtor.realtor_stage = REALTOR_STAGE.gold;
        break;

      default:
        break;
    }

    return realtor.save(transactionHost);
  }

  // called after every product subscription payment, also called from a queue
  async updateRealtorSales(productSubId: number, amountPaid: number, productSubStatus: string, transactionHost): Promise<RealtorTree | any> {

    const productSub = await this.productSubService.findById(productSubId);
    const { referred_by_id } = await this.customerService.findById(productSub.customer_id);
    const productPrice = parseInt(productSub.total_amount);
    const totalSubAmountPaid = parseInt(productSub.amount_paid);

    // customer has no upline
    if (!referred_by_id)
      return;

    const realtorTree = await this.findOne({
      realtor_id: referred_by_id
    });

    // 1st payment made, outright payment also executes here
    if (productSubStatus == PRODUCT_SUB_STATUS.initiated || !productSub.is_installment) {

      const productsSoldArr = realtorTree.products_sold_ids;
      const subscriptionSoldArr = realtorTree.subscription_sold_ids;

      if (!productsSoldArr.includes(productSub.product_id)) {
        productsSoldArr.push(productSub.product_id);
        realtorTree.products_sold_ids = productsSoldArr;
      }

      if (!subscriptionSoldArr.includes(productSub.id)) {
        subscriptionSoldArr.push(productSub.id);
        realtorTree.subscription_sold_ids = subscriptionSoldArr;
      }

      if (!productSub.is_installment) {
        realtorTree.completed_sales++;
        realtorTree.completed_sales_value = (parseInt(realtorTree.completed_sales_value) + productPrice).toString();
        return realtorTree.save(transactionHost);
      }

      realtorTree.incompleted_sales++;
      realtorTree.incompleted_sales_value = (parseInt(realtorTree.incompleted_sales_value) + amountPaid).toString();
      return realtorTree.save(transactionHost);
    }

    // if product subscription is completed
    else if (productSubStatus == PRODUCT_SUB_STATUS.completed) {

      realtorTree.completed_sales++;
      realtorTree.completed_sales_value = (parseInt(realtorTree.completed_sales_value) + productPrice).toString();

      // decreament incomplete-fields
      realtorTree.incompleted_sales--;
      realtorTree.incompleted_sales_value = (parseInt(realtorTree.incompleted_sales_value) - totalSubAmountPaid).toString();
      return realtorTree.save(transactionHost);
    }

    else {
      realtorTree.incompleted_sales_value = (parseInt(realtorTree.incompleted_sales_value) + amountPaid).toString();
      return realtorTree.save(transactionHost);
    }
  }


  // NB: this is called from a Txtn Queue Process, Execute other txtns on this method
  // process commission and company reservation
  async processCommission(productSubId: number, amountPaid: number, transactionHost): Promise<any> {

    const commissionProductPmtArr: CommissionPmt[] = [];
    let amount;

    const adminWalletsObj = await this.walletService.getAdminWallets();

    const productSub = await this.productSubService.findById(productSubId);
    const customer = await this.customerService.findById(productSub.customer_id); // cld be customer or realtor

    amount = this.calcPercentage(amountPaid, WITHHOLDINGTAX);
    commissionProductPmtArr.push({
      wallet_id: adminWalletsObj[ADMIN_WALLETS.WITHHOLDING_TAX],
      amount,
      type: TXTN_TYPE.withholding_tax
    });

    if (!customer.referred_by_id) {

      // product payment
      amount = this.calcPercentage(amountPaid, (PRODUCT_PAYMENT + REALTOR_COMMISSION + CUSTOMER_COMMISSION));
      commissionProductPmtArr.push({
        wallet_id: adminWalletsObj[ADMIN_WALLETS.PRODUCT_PAYMENT],
        amount,
        type: TXTN_TYPE.product_payment
      });

      await this.payCommission(commissionProductPmtArr, productSub.id, transactionHost);
      return;

    }  // end -- if customer wasn't referred


    const immediateUpline = await this.customerService.findById(customer.referred_by_id);

    if (immediateUpline.is_realtor) {

      //commission to realtor
      amount = this.calcPercentage(amountPaid, REALTOR_COMMISSION);
      commissionProductPmtArr.push({
        wallet_id: immediateUpline.wallet_id,
        amount
      });

      // product payment
      amount = this.calcPercentage(amountPaid, (PRODUCT_PAYMENT + CUSTOMER_COMMISSION));
      commissionProductPmtArr.push({
        wallet_id: adminWalletsObj[ADMIN_WALLETS.PRODUCT_PAYMENT],
        amount,
        type: TXTN_TYPE.product_payment
      });

    }
    else {

      //commission to customer
      amount = this.calcPercentage(amountPaid, CUSTOMER_COMMISSION);
      commissionProductPmtArr.push({
        wallet_id: immediateUpline.wallet_id,
        amount
      });

      // product payment
      amount = this.calcPercentage(amountPaid, (PRODUCT_PAYMENT + REALTOR_COMMISSION));
      commissionProductPmtArr.push({
        wallet_id: adminWalletsObj[ADMIN_WALLETS.PRODUCT_PAYMENT],
        amount,
        type: TXTN_TYPE.product_payment
      });
    }

    await this.payCommission(commissionProductPmtArr, productSub.id, transactionHost);
    return true;
  }


  private async payCommission(commissionPmt: CommissionPmt[], productSubId: number, transactionHost): Promise<boolean> {

    for (let i = 0; i < commissionPmt.length; i++) {
      const { amount, type, wallet_id } = commissionPmt[i];
      const { oldBal, newBal, customer_id, isAdminWallet } = await this.walletService.credit(wallet_id, amount, transactionHost);

      // create commission txtn after admin wallet txtn successful
      // if (!type) {
        const txtn = await this.txtnService.create({
          channel: TXTN_CHANNEL.wallet,
          status: TXTN_STATUS.success, // wallet already credited above
          position: TXTN_POSITION.credit,
          type: type ? type : TXTN_TYPE.commission,
          reference: genRandomXters(10, true),
          wallet_id,
          product_sub_id: productSubId,
          total_amount: amount,
          old_balance: parseInt(oldBal),
          new_balance: parseInt(newBal),
          customer_id
        });
      // }
      
      if (!isAdminWallet) {
        const customer = await this.customerService.findById(txtn.customer_id, false);
        this.emailHelper.transactionNotification(txtn, customer);
      }
      
    }
    return true;
  }


  private calcPercentage(amount: number, percentage: number): number {

    if (percentage <= 0 || percentage > 100)
      throw new BadRequestException(ERROR_MESSAGES.InvalidPercentageValue);

    if (amount <= 0)
      throw new BadRequestException(ERROR_MESSAGES.InvalidAmountValue);

    return amount * percentage / 100;
  }
}
