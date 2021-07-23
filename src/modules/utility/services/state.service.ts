import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions, Op } from 'sequelize';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { StateModel as State } from '../models/state.model';
import { STATE_REPOSITORY } from '../constants';


@Injectable()
export class StateService {
  constructor(
    @Inject(STATE_REPOSITORY) private readonly stateRepo: typeof State,
  ) { }

  private attributes = ['id', 'name'];

  async findAll(params): Promise<FindAllQueryInterface<State>> {
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

    const states = await this.stateRepo.findAndCountAll(query);
    // const paging = pagingParser(query, states.count, states.rows.length);

    return {
      // paging,
      rows: states.rows
    };
  }

  async findById(id: number): Promise<State> {
    const state = await this.stateRepo.findByPk(id, {
      attributes: this.attributes,
    });

    if (!state)
      throw new BadRequestException(ERROR_MESSAGES.StateNotFound);

    return state;
  }

  async findByName(stateName: string): Promise<State> {
    const state = await this.stateRepo.findOne({
      where: {
        name: stateName
      },
      attributes: this.attributes,
    });

    if (!state)
      throw new BadRequestException(ERROR_MESSAGES.StateNotFound);

    return state;
  }
}
