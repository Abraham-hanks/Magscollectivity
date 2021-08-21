import { Controller, Get, Param, ParseIntPipe, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SCOPES } from 'src/common/auth/scopes';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { Role } from '../../auth/decorator/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { RealtorTreeService } from '../services/realtor-tree.service';

@ApiTags('Realtor Tree')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
@Controller('realtor-tree')
export class RealtorTreeController {
  constructor(private readonly realtorTreeService: RealtorTreeService) { }

  @Get()
  @Role(SCOPES.READ_REALTOR_TREE)
  async findAll(@Query() query: BaseQueryFiltersDto,
  ) {
    query = parseQueryObj(query, []);

    return this.realtorTreeService.findAll(query);
  }

  @Role(SCOPES.READ_REALTOR_TREE)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.realtorTreeService.findById(id);
  }
}
