import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { FindAllQueryInterface } from "src/common/interface/find-query.interface";
import { ERROR_MESSAGES } from "src/common/utils/error-messages";
import { pagingParser } from "src/common/utils/paging-parser";
import { CustomerModel } from "src/modules/customer/models/customer.model";
import { PaymentPlanService } from "src/modules/product/services/payment-plan.service";
import { CHARGE_SUBSCRIPTION_REPOSITORY, CHARGE_SUBSCRIPTION_STATUS } from "../constants";
import { CreateChargeDto } from "../dto/create-charge.dto";
import { ChargeSubscriptionModel as ChargeSubscription } from "../models/charge-subscription.model"
import { ChargeModel } from "../models/charge.model";

@Injectable()
export class ChargeSubscriptionService {
  constructor(
    @Inject(CHARGE_SUBSCRIPTION_REPOSITORY) private chargeSubRepo: typeof ChargeSubscription,
  ) { }

  async create(newCharge: CreateChargeDto, transactionHost:any): Promise<ChargeSubscription> {
    return  this.chargeSubRepo.create(newCharge, transactionHost);
  }

  async findAll(params): Promise<FindAllQueryInterface<ChargeSubscription>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at']
      },
      where: {
        ...params.where
      }
    };

    const chargeSubscriptions = await this.chargeSubRepo.findAndCountAll(query);
    const paging = pagingParser(query, chargeSubscriptions.count, chargeSubscriptions.rows.length);

    return {
      paging,
      rows: chargeSubscriptions.rows
    };
  }

  async findById(id: number): Promise<ChargeSubscription> {
    const chargeSub = await this.chargeSubRepo.findByPk(id, {
      attributes: { 
        exclude: ['deleted_at'] 
      },
      include: [
        {
          model: CustomerModel,
          attributes: { exclude: ['deleted_at'] },
        },
        {
          model: ChargeModel,
          attributes: { exclude: ['deleted_at'] },
        }
        // {
        //     model: ChargeModel,
        //     attributes: { exclude: ['deleted_at'] },
        // }
      ],
    });

    if (!chargeSub)
      throw new BadRequestException(ERROR_MESSAGES.ChargeSubscriptionNotFound);

    return chargeSub;
  }

  async setStatus(id: number, status: CHARGE_SUBSCRIPTION_STATUS): Promise<ChargeSubscription> {
    const chargeSub = await this.findById(id);
    chargeSub.status = status;
    
    return chargeSub.save();
  }
}