import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { pagingParser } from 'src/common/utils/paging-parser';
import { AdminModel } from 'src/modules/admin/admin.model';
import { PAYMENT_PLAN_REPOSITORY, PAYMENT_PLAN_TYPE } from '../constants';
import { CreatePaymentPlanDto } from '../dto/payment-plan/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from '../dto/payment-plan/update-payment-plan.dto';
import { PaymentPlanModel as PaymentPlan } from '../models/payment-plan.model'
import { ProductService } from './product.service';

@Injectable()
export class PaymentPlanService {
  constructor(
    @Inject(PAYMENT_PLAN_REPOSITORY) private readonly paymentPlanRepo: typeof PaymentPlan,
    private readonly productService: ProductService,
  ) { }

  async createPaymentPlan(newPlan: CreatePaymentPlanDto): Promise<PaymentPlan> {

    // check if product id exists
    await this.productService.findById(newPlan.product_id);

    const newPlanObj: any = {
      product_id: newPlan.product_id,
      duration: newPlan.duration,
      amount_per_unit: newPlan.amount_per_unit,
      type: newPlan.type
    }

    if (newPlan.minimun_no_units)
      newPlanObj.minimun_no_units = newPlan.minimun_no_units;

    const exisitngPlan = await this.findOne(newPlanObj, false);

    if (exisitngPlan)
      throw new BadRequestException(ERROR_MESSAGES.DuplicatePaymentPlan);

    return this.paymentPlanRepo.create(newPlan);
  }

  async findAll(params): Promise<FindAllQueryInterface<PaymentPlan>> {
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

    const paymentPlans = await this.paymentPlanRepo.findAndCountAll(query);
    const paging = pagingParser(query, paymentPlans.count, paymentPlans.rows.length);

    return {
      paging,
      rows: paymentPlans.rows
    };
  }

  async findById(id: number): Promise<PaymentPlan> {
    const payment_plan = await this.paymentPlanRepo.findByPk(id,
      {
        attributes: {
          exclude: DefaultQueryAttributeExclude
        },
        include: [
          {
            model: AdminModel,
            as: 'created_by',
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
          },
          {
            model: AdminModel,
            as: 'updated_by',
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
          },
        ],
      });

    if (!payment_plan)
      throw new BadRequestException(ERROR_MESSAGES.PaymentPlanNotFound);

    return payment_plan;

  }

  async findOne(params, throwNotFoundError = true): Promise<PaymentPlan> {
    const payment_plan = await this.paymentPlanRepo.findOne({
      where: params,
      attributes: {
        exclude: DefaultQueryAttributeExclude
      },
      include: [
        {
          model: AdminModel,
          as: 'created_by',
          attributes: {
            exclude: DefaultQueryAttributeExclude
          },
        },
        {
          model: AdminModel,
          as: 'updated_by',
          attributes: {
            exclude: DefaultQueryAttributeExclude
          },
        },
      ],
    });

    if (!payment_plan && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.PaymentPlanNotFound);

    return payment_plan;

  }

  async update(id: number, updateProductDto: UpdatePaymentPlanDto): Promise<PaymentPlan> {

    const paymentPlan = await this.findById(id);

    return paymentPlan.update(updateProductDto);
  }

  async acDeactivatePaymentPlan(id: number, activate: boolean): Promise<PaymentPlan> {
    const payment_plan = await this.findById(id);

    if (activate && payment_plan.is_active)
      throw new BadRequestException(ERROR_MESSAGES.PaymentPlanAlreadyActive);

    if (!activate && !payment_plan.is_active)
      throw new BadRequestException(ERROR_MESSAGES.PaymentPlanAlreadyDeactivated);

    payment_plan.is_active = activate;
    return payment_plan.save();
  }
}
