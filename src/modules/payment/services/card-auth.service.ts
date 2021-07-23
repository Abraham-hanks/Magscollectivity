import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { DefaultQueryAttributeExclude } from "src/common/constants";
import { FindAllQueryInterface } from "src/common/interface/find-query.interface";
import { ERROR_MESSAGES } from "src/common/utils/error-messages";
import { pagingParser } from "src/common/utils/paging-parser";
import { CustomerModel } from "src/modules/customer/models/customer.model";
import { CARD_AUTH_REPOSITORY, CreateCardAuth } from "../constants";
import { CardAuthModel as CardAuth } from "../models/card-auth.model";

@Injectable()
export class CardAuthService {
  constructor(
    @Inject(CARD_AUTH_REPOSITORY) private readonly cardAuthRepo: typeof CardAuth,
    // private readonly customerService: CustomerService,
    // private readonly bankService: BankService,
  ) { }

  async create(newcardAuth: CreateCardAuth): Promise<CardAuth> {
    // await this.customerService.findById(newcardAuth.customer_id);

    try {
      // newcardAuth.bank_id = (await this.bankService.findByName(newcardAuth.bank_name)).id;
    } catch (error) {
      // console.log(error)
    }

    return this.cardAuthRepo.create(newcardAuth);
  }

  async findById(id: number): Promise<CardAuth> {
    const cardAuth = await this.cardAuthRepo.findByPk(id,
      {
        attributes: {
          exclude: DefaultQueryAttributeExclude,
        },
        include: [
          {
            model: CustomerModel,
            attributes: { exclude: DefaultQueryAttributeExclude },
          },
        ]
      }
    );
    if (!cardAuth)
      throw new BadRequestException(ERROR_MESSAGES.CardAuthNotFound);

    return cardAuth;
  }

  async findAll(params): Promise<FindAllQueryInterface<CardAuth>> {
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

    const cardAuth = await this.cardAuthRepo.findAndCountAll(query);
    const paging = pagingParser(query, cardAuth.count, cardAuth.rows.length);

    return {
      paging,
      rows: cardAuth.rows
    };
  }

  async acDeactivateCardAuth(id: number, activate: boolean): Promise<CardAuth> {
    const cardAuth = await this.findById(id);

    if (activate && cardAuth.is_active)
      throw new BadRequestException(ERROR_MESSAGES.CardAuthAlreadyActive);

    if (!activate && !cardAuth.is_active)
      throw new BadRequestException(ERROR_MESSAGES.CardAuthAlreadyDeactivated);

    cardAuth.is_active = activate;
    return cardAuth.save();
  }

  async deleteCardAuth(id: number) {
    const cardAuth = await this.findById(id);
    return cardAuth.destroy();
  }
}
