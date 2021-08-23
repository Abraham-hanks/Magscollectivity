import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CustomerService } from '../../customer/services/customer.service';
import { ChargeModel as Charge } from '../models/charge.model';
import { CHARGE_REPOSITORY } from '../constants';
import { CreateChargeDto } from '../dto/create-charge.dto';
import { ChargeSubscriptionService } from './charge-subscription.service';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { FindOptions } from 'sequelize';
import { pagingParser } from 'src/common/utils/paging-parser';
import { ProductService } from 'src/modules/product/services/product.service';
import { CustomerModel } from 'src/modules/customer/models/customer.model';
import { ProductModel } from 'src/modules/product/models/product.model';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { AdminModel } from 'src/modules/admin/admin.model';
import { ProductSubModel } from 'src/modules/product-subscription/product-sub.model';


@Injectable()
export class ChargeService {
  constructor(
    @Inject(CHARGE_REPOSITORY) private readonly chargeRepo: typeof Charge,
    private readonly chargeSubService: ChargeSubscriptionService,
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
  ) { }

  async create(newCharge: CreateChargeDto): Promise<Charge> {
    //TODO: Notify customer of charge
    if (await this.customerService.findById(newCharge.customer_id) && await this.productService.findById(newCharge.product_id)) {
      const charge = await this.chargeRepo.create(newCharge);
      return charge;
    }
    
    // else what happens?
  }

  async findAll(params): Promise<FindAllQueryInterface<Charge>> {
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

    const charges = await this.chargeRepo.findAndCountAll(query);
    const paging = pagingParser(query, charges.count, charges.rows.length);

    return {
      paging,
      rows: charges.rows
    };
  }
  

  async findById(id: number): Promise<Charge> {
    const charge = await this.chargeRepo.findByPk(id,
    {
      attributes: {
        exclude: ['deleted_at', 'created_at']
      },
      include: [
        {
          model: CustomerModel,
          attributes: { exclude: DefaultQueryAttributeExclude },
        },
        {
          model: ProductSubModel,
          attributes: { exclude: DefaultQueryAttributeExclude },
        },
        {
          model: AdminModel,
          attributes: { exclude: DefaultQueryAttributeExclude },
        },
        // {
        //   model: ChargeSubscriptionModel,
        //   attributes: { exclude: DefaultQueryAttributeExclude },
        // }
      ]
    });

    if (!charge)
      throw new BadRequestException(ERROR_MESSAGES.ChargeNotFound);

    return charge;
  }
  
  // async acDeactivateCharge(id: number, activate: boolean): Promise<Charge> {
  //   const charge = await this.findById(id);

  //   if (activate && charge.is_active)
  //     throw new BadRequestException(ERROR_MESSAGES.ChargeAlreadyActive);

  //   if (!activate && !charge.is_active)
  //     throw new BadRequestException(ERROR_MESSAGES.ChargeAlreadyDeactivated);

  //   charge.is_active = activate;
  //   return charge.save();
  // }
}
