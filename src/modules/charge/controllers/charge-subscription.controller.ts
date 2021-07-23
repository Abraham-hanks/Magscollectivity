import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SCOPES } from 'src/common/auth/scopes';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { Role } from '../../auth/decorator/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { ChargeSubQueryFiltersArray, ChargeSubQueryFiltersDto } from '../dto/charge-sub-query-filters.dto';
import { ChargeSubStatusDto } from '../dto/charge-sub-query-filters.dto';
import { ChargeSubscriptionService } from '../services/charge-subscription.service';

@ApiTags('Charge Subscription')
@Controller('charge-subscription')
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor, TransformInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class ChargeSubscriptionController {
  constructor(private readonly chargeSubService: ChargeSubscriptionService) { }

  @Role(SCOPES.READ_CHARGE_SUBSCRIPTION)
  @Get()
  async findAll(
    @Query() query: ChargeSubQueryFiltersDto
  ) {
    query = parseQueryObj(query, ChargeSubQueryFiltersArray);
    return this.chargeSubService.findAll(query);
  }

  @Role(SCOPES.READ_CHARGE_SUBSCRIPTION)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.chargeSubService.findById(id)
  }

  @Role(SCOPES.MODIFY_CHARGE_SUBSCRIPTION)
  @Put('status/:id')
  async setChargeSubStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusUpdate: ChargeSubStatusDto,
  ) {
    
    return this.chargeSubService.setStatus(id, statusUpdate.status);
  }
}