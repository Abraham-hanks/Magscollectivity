import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AdminModel as Admin } from './admin.model';
import { ADMIN_REPOSITORY } from './constants';
import { CreateAdminDto } from './dto/admin.dto';
import { pagingParser } from 'src/common/utils/paging-parser';
import { FindOptions, Op } from 'sequelize';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';

@Injectable()
export class AdminService {
  constructor(
    @Inject(ADMIN_REPOSITORY) private readonly adminRepo: typeof Admin,
  ) { }

  async create(newAdmin: CreateAdminDto, transactionHost): Promise<Admin> {

    return this.adminRepo.create(newAdmin, transactionHost);
  }

  async findAll(params): Promise<FindAllQueryInterface<Admin>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at', 'updated_at', 'password']
      },
      where: {
        ...params.where
      }
    };

    // search
    if (params.search) {
      params.search = '%' + params.search + '%';

      query.where[Op.or] = {
        'firstname': {
          [Op.iLike]: params.search
        },
        'lastname': {
          [Op.iLike]: params.search
        },
        'email': {
          [Op.iLike]: params.search
        },
      }
    }

    const admins = await this.adminRepo.findAndCountAll(query);
    const paging = pagingParser(query, admins.count, admins.rows.length);

    return {
      paging,
      rows: admins.rows
    };
  }

  async findById(id: number): Promise<Admin> {
    const admin = await this.adminRepo.findByPk(id,
      {
        attributes: { exclude: ['deleted_at'] },
        include: [
          // {
          //   model: Model,
          //   attributes: {
          //     exclude: ['created_at', 'deleted_at', 'updated_at']
          //   },
          // },
        ],
      });

    if (!admin)
      throw new BadRequestException(ERROR_MESSAGES.AdminNotFound);

    return admin;
  }

  async findOne(params): Promise<Admin> {
    const admin = await this.adminRepo.findOne(
      {
        where: { ...params },
        attributes: { exclude: ['deleted_at'] },
        include: [
          // {
          //   model: Model,
          //   attributes: {
          //     exclude: ['created_at', 'deleted_at', 'updated_at']
          //   },
          // },
        ],
      });

    return admin;
  }
}
