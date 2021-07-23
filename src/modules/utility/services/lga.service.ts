import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions, Op } from 'sequelize';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { LgaModel as Lga } from '../models/lga.model';
import { LGA_REPOSITORY } from '../constants';


@Injectable()
export class LgaService {
  constructor(
    @Inject(LGA_REPOSITORY) private readonly lgaRepo: typeof Lga,
  ) { }

  private attributes = ['id', 'name', 'state_id'];

  async findAll(params): Promise<FindAllQueryInterface<Lga>> {
    const query: FindOptions = {
      // limit: params.limit,
      // offset: params.skip,
      order: params.order,
      attributes: this.attributes,
      where: {
        ...params.where,
      }
    };

    // search
    if (params.search) {
      query.where[Op.or] = {
        'name': {
          [Op.iLike]: params.search
        }
      };
    }

    const lgas = await this.lgaRepo.findAndCountAll(query);
    // const paging = pagingParser(query, lgas.count, lgas.rows.length);

    return {
      // paging,
      rows: lgas.rows
    };
  }

  async findById(id: number): Promise<Lga> {
    const lga = await this.lgaRepo.findByPk(id, {
      attributes: this.attributes,
    });

    if (!lga)
      throw new BadRequestException(ERROR_MESSAGES.LgaNotFound);

    return lga;
  }

  async findByName(lgaName: string): Promise<Lga> {
    const lga = await this.lgaRepo.findOne({
      where: {
        name: lgaName
      },
      attributes: this.attributes,
    });

    if (!lga)
      throw new BadRequestException(ERROR_MESSAGES.LgaNotFound);

    return lga;
  }
}
