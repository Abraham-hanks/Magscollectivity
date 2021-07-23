import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { RoleModel as Role } from './models/role.model';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { pagingParser } from 'src/common/utils/paging-parser';
import { ROLE_REPOSITORY, SCOPE_REPOSITORY } from './constants';
import { CreateRoleDto } from './dto/create-role.dto';
import { ScopeModel as Scope } from './models/scope.model';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';


@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: typeof Role,
    @Inject(SCOPE_REPOSITORY) private readonly scopeRepo: typeof Scope,
  ) { }

  // async create(newRole: CreateRoleDto): Promise<Role> {

  //   return this.roleRepo.create(newRole);
  //   // return this.roleRepo.create();
  // }

  async findAll(params): Promise<FindAllQueryInterface<Role>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at', 'updated_at']
      },
      where: {
        ...params.where
      }
    };

    const roles = await this.roleRepo.findAndCountAll(query);
    const paging = pagingParser(query, roles.count, roles.rows.length);

    return {
      paging,
      rows: roles.rows
    };
  }

  async findAllScopes(params): Promise<FindAllQueryInterface<Scope>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at', 'updated_at']
      },
      where: {
        ...params.where
      }
    };

    const scopes = await this.scopeRepo.findAndCountAll(query);
    const paging = pagingParser(query, scopes.count, scopes.rows.length);

    return {
      paging,
      rows: scopes.rows
    };
  }

  async findById(id: number): Promise<Role> {
    const role = await this.roleRepo.findByPk( id, {
      attributes: { exclude: ['deleted_at'] }
    });
    if (!role)
      throw new BadRequestException(ERROR_MESSAGES.RoleNotFound);

    return role;
  }

  async findByName(roleName: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: {
        name: roleName
      },
      attributes: { exclude: ['deleted_at'] }
    });
    
    if (!role)
      throw new BadRequestException(ERROR_MESSAGES.RoleNotFound);

    return role;
  }
}
