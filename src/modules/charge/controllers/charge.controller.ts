import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SCOPES } from 'src/common/auth/scopes';
import { Role } from '../../auth/decorator/role.decorator';
import { GetUser } from '../../auth/decorator/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { ChargeService } from '../services/charge.service';
import { CreateChargeDto } from '../dto/create-charge.dto';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { ChargeQueryFiltersArray, ChargeQueryFiltersDto } from '../dto/charge-query-filters.dto';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';

@ApiTags('Charge')
@Controller('charge')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) { }

  @Role(SCOPES.WRITE_CHARGE)
  @Post()
  async create(
    @Body() newCharge: CreateChargeDto,
    @GetUser("user_id") user_id: number,
  ) {
    newCharge.created_by_id = user_id;
    return this.chargeService.create(newCharge);
  }

  @Role(SCOPES.READ_CHARGE)
  @Get()
  async findAll(
    @Query() query: ChargeQueryFiltersDto
    ) {

    query = parseQueryObj(query, ChargeQueryFiltersArray);
    return this.chargeService.findAll(query);
  }

  @Role(SCOPES.READ_CHARGE)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.chargeService.findById(id)
  }

  @Role(SCOPES.ACTIVATE_CHARGE)
  @Put('activate/:id')
  async activate(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.chargeService.acDeactivateCharge(id, true);
  }

  @Role(SCOPES.DEACTIVATE_CHARGE)
  @Put('deactivate/:id')
  async deactivate(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.chargeService.acDeactivateCharge(id, false);
  }
}
