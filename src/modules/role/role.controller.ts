import { Controller, Get, Param, ParseIntPipe, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { SCOPES } from 'src/common/auth/scopes';
import { Role } from '../auth/decorator/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { RoleQueryFiltersDto } from './dto/role-query-filters.dto';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';


@ApiTags('Role')
@Controller('role')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  // @Post()
  // async create(
  //   @Body(new ValidationPipe()) newRole: CreateRoleDto,
  // ) {
  //   return this.roleService.create(newRole);
  // }

  @Get('scopes')
  @Role(SCOPES.READ_SCOPE)
  async findAllScopes(
    @Query(new ValidationPipe({ transform: true })) query: RoleQueryFiltersDto) {

    query = parseQueryObj(query, ['name', 'is_active']);
    return this.roleService.findAllScopes(query);
  }

  @Get()
  @Role(SCOPES.READ_ROLE)
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: RoleQueryFiltersDto) {

    query = parseQueryObj(query, ['name', 'is_active']);
    return this.roleService.findAll(query);
  }

  @Get(':id')
  @Role(SCOPES.READ_ROLE)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.roleService.findById(id);
  }

}
