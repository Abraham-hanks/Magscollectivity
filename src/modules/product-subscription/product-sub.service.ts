import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { ProductSubModel as ProductSub } from './product-sub.model';
import { PRODUCT_SUB_REPOSITORY, PRODUCT_SUB_STATUS } from './constants';
import { CreateProductSubDto } from './dto/create-product-sub.dto';
import { pagingParser } from 'src/common/utils/paging-parser';
import { FindOptions, Op } from 'sequelize';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { ProductService } from '../product/services/product.service';
import { PaymentPlanService } from '../product/services/payment-plan.service';
import { PAYMENT_PLAN_TYPE } from '../product/constants';
import { getNextMonthDay } from 'src/common/utils/date-processor';
import { configService } from 'src/common/config/config.service';
import { ProductModel } from '../product/models/product.model';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { RealtorTreeService } from '../customer/services/realtor-tree.service';
import { TxtnService } from '../txtn/services/txtn.service';
import { CustomerModel } from '../customer/models/customer.model';
import { EmailHelper } from '../utility/services/email/email.helper';
import { Readable } from 'stream';


@Injectable()
export class ProductSubscriptionService {
  constructor(
    @Inject(PRODUCT_SUB_REPOSITORY) private readonly productSubRepo: typeof ProductSub,
    private readonly paymentPlanService: PaymentPlanService,
    private readonly productService: ProductService,
    @Inject(forwardRef(() => RealtorTreeService)) private readonly realtorTreeService: RealtorTreeService,
    @Inject(forwardRef(() => TxtnService)) private readonly txtnService: TxtnService,
    private readonly emailHelper: EmailHelper,
  ) { }

  private ProductSubQueryAttributeInclude = [
    {
      model: ProductModel,
      attributes: {
        exclude: DefaultQueryAttributeExclude
      }
    }
  ];


  async create(newSub: CreateProductSubDto): Promise<any> {

    const product = await this.productService.findById(newSub.product_id);
    const paymentPlan = await this.paymentPlanService.findById(newSub.payment_plan_id);
    const { minimun_no_units, minimun_deposit_amount } = paymentPlan;
    // calculate total amount
    const totalAmount = parseInt(paymentPlan.amount_per_unit) * newSub.units;

    if (paymentPlan.product_id != product.id)
      throw new BadRequestException(ERROR_MESSAGES.ProductIdAndPaymentPlanMismactch);

    if (product.available_units < newSub.units)
      throw new BadRequestException(ERROR_MESSAGES.InsufficientProductUnits + product.available_units);

    if (minimun_no_units && newSub.units < minimun_no_units)
      throw new BadRequestException(ERROR_MESSAGES.PaymentPlanRequiresMinimumUnitsOf + paymentPlan.minimun_no_units);

    if (minimun_deposit_amount && newSub.initial_payment_amount < parseInt(minimun_deposit_amount))
      throw new BadRequestException(ERROR_MESSAGES.PaymentPlanRequiresMinimumDepositAmountOf + paymentPlan.minimun_deposit_amount);

    if (newSub.initial_payment_amount > totalAmount)
      newSub.initial_payment_amount = totalAmount;

    newSub = {
      ...newSub,
      amount_per_unit: parseInt(paymentPlan.amount_per_unit),
      is_installment: paymentPlan.type === PAYMENT_PLAN_TYPE.installment ? true : false,
      duration: paymentPlan.duration,
      total_amount: totalAmount
    }

    // if promotion_id, apply discount
    newSub.total_amount = parseInt(paymentPlan.amount_per_unit) * newSub.units;

    if (paymentPlan.type == PAYMENT_PLAN_TYPE.installment) {
      newSub.duration = paymentPlan.duration;
      newSub.start_date = new Date();
      newSub.end_date = getNextMonthDay(paymentPlan.duration);
    }

    const createdSub = await this.productSubRepo.create(newSub);

    // make 1st payment according to payment plan selected
    // subPaymentRes cld be paystack url or string 
    const subPaymentRes = await this.txtnService.subscriptionPayment({
      customer_id: createdSub.customer_id,
      product_sub_id: createdSub.id,
      amount: newSub.initial_payment_amount,
      callback_url: newSub.callback_url || configService.getAppUrl(),
      payment_method: newSub.payment_method
    });

    return {
      createdSubscription: createdSub,
      ...subPaymentRes
    };
  }

  async findAll(params): Promise<FindAllQueryInterface<ProductSub>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at']
      },
      where: {
        ...params.where
      },
      include: this.ProductSubQueryAttributeInclude
    };

    // search
    if (params.search) {
      params.search = '%' + params.search + '%';

      query.where[Op.or] = {
        '$product.name$': {
          [Op.iLike]: params.search
        },
        '$product.description$': {
          [Op.iLike]: params.search
        },
        '$product.address$': {
          [Op.iLike]: params.search
        },
        '$product.state_name$': {
          [Op.iLike]: params.search
        },
        '$product.lga_name$': {
          [Op.iLike]: params.search
        },
        // 'features': {
        //   [Op.iLike]: params.search
        // },
        '$product.property_type$': {
          [Op.iLike]: params.search
        },
      }
    }

    const productSubs = await this.productSubRepo.findAndCountAll(query);
    const paging = pagingParser(query, productSubs.count, productSubs.rows.length);

    return {
      paging,
      rows: productSubs.rows
    };
  }

  async getCount(params): Promise<number> {
    return this.productSubRepo.count({
      where: params.where
    });
  }

  getStream(params) {
    
    let maxPage;
    const query: FindOptions | any = {
      page: 0,
      limit: 100,
      // order: params.order,
      // ...params
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
        return this.productSubRepo.findAll(query)
          .each((item) => {
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
      // sentry
      console.log('err: ' + err);
    }
  }

  async findById(id: number, throwNotFoundError = true): Promise<ProductSub> {
    const productSub = await this.productSubRepo.findByPk(id,
      {
        attributes: { exclude: ['deleted_at'] },
        // include: this.ProductSubQueryAttributeInclude
        include: [
          {
            model: ProductModel,
            attributes: {
              exclude: DefaultQueryAttributeExclude
            }
          },
          {
            model: CustomerModel,
            attributes: {
              exclude: DefaultQueryAttributeExclude
            }
          }
        ]
      });

    if (!productSub && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.ProductSubscriptionNotFound);

    return productSub;
  }

  async findOne(params, throwNotFoundError = true): Promise<ProductSub> {
    const productSub = await this.productSubRepo.findOne(
      {
        where: params,
        attributes: { exclude: ['deleted_at'] },
        include: [
          {
            model: ProductModel,
            attributes: {
              exclude: DefaultQueryAttributeExclude
            }
          }
        ]
        // include: this.ProductSubQueryAttributeInclude
      });

    if (!productSub && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.ProductSubscriptionNotFound);

    return productSub;
  }


  // NB: this is called from a Txtn Queue Process, Execute other txtns on this method
  async productSubPaymentSuccess(id: number, txtn_amount: string, transactionHost): Promise<any> {

    let txtnAmount = parseInt(txtn_amount);

    // const { product_sub_id } = await this.txtnService.findById(txtnId);
    const productSub = await this.findById(id);
    const amountLeft = parseInt(productSub.amount_left);
    let isFirstSubPayment = false;

    // if it's 1st payment
    if (parseInt(productSub.amount_paid) == 0) {
      const product = await this.productService.findById(productSub.product_id);

      if (product.available_units < productSub.units) {

        // purchase existing units refund excess money to wallet
        // if (product.available_units == 0)
        // refund all
      }
      isFirstSubPayment = true;
      productSub.status = PRODUCT_SUB_STATUS.on_going;

      product.available_units -= productSub.units;
      await product.save(transactionHost);
    }

    // if out_right, mark as done
    if (!productSub.is_installment) {
      productSub.status = PRODUCT_SUB_STATUS.completed;

      // send completed subscription email
    }

  
    if ( txtnAmount >= amountLeft) {

      if (txtnAmount > amountLeft) // when ignore_amount in fund request is used
        txtnAmount = amountLeft;

      productSub.status = PRODUCT_SUB_STATUS.completed;
      // send completed subscription email
    }

    // update product sub
    // productSub.duration_count += 1;
    
    productSub.amount_paid = (parseInt(productSub.amount_paid) + txtnAmount).toString();
    productSub.next_deduction_date = getNextMonthDay();

    // save productSub
    await productSub.save(transactionHost);
    
    this.emailHelper.productSubNotification(productSub);
    

    // for testing only!!!!!!!
    // !!!!!!!!!!!!!!
    // try {
      // pay commission
      await this.realtorTreeService.processCommission(productSub.id, txtnAmount, transactionHost);

      // update realtor tree with sales
      await this.realtorTreeService.updateRealtorSales(productSub.id, txtnAmount, productSub.status, transactionHost);

      // update realtor stage
      await this.realtorTreeService.upgradeRealtorStage(productSub.customer_id, transactionHost);

      return true;
    // }
    // catch (e) {
    //   console.log('e: ' + e);
    // }
  }

}
