import { Body, Param, ParseIntPipe, Post, Put, Query, Request, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiHideProperty, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/decorator/user.decorator';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { AdminQueryFiltersDto } from './dto/admin-query-filters.dto';
import { Role } from '../auth/decorator/role.decorator';
import { SCOPES } from 'src/common/auth/scopes';
import { RoleGuard } from '../auth/guards/role.guard';
import { CreateAdminDto } from './dto/admin.dto';
import { AuthService } from '../auth/auth.service';
import { ROLE_NAMES } from '../role/constants';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';


@ApiTags('Admin')
@ApiBearerAuth('JWT')
// @UseGuards(JwtAuthGuard, RoleGuard)
@Controller('admin')
@UseInterceptors(AuditInterceptor, TransformInterceptor)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService
    ) { }

  @Get()
  @Role(SCOPES.READ_ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: AdminQueryFiltersDto,
  ) {
    query = parseQueryObj(query,
      [
        'email', 'is_active'
      ]);

    return this.adminService.findAll(query);
  }

  // @Role(SCOPES.READ_ADMIN)
  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async myProfile(
    @GetUser('user_id') user_id: number,
  ) {

    return this.adminService.findById(user_id);
  }

  @Get(':id')
  @Role(SCOPES.READ_ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminService.findById(id);
  }

  @Role(SCOPES.ACTIVATE_ADMIN)
  @Put('activate/:id')
  async activate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.authService.acDeactivateUser(id, ROLE_NAMES.admin, true);
  }

  @Role(SCOPES.DEACTIVATE_ADMIN)
  @Put('deactivate/:id')
  async deactivate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.authService.acDeactivateUser(id, ROLE_NAMES.admin, false);
  }

}
