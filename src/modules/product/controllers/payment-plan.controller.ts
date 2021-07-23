import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SCOPES } from 'src/common/auth/scopes';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { GetUser } from 'src/modules/auth/decorator/user.decorator';
import { Role } from '../../auth/decorator/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CreatePaymentPlanDto } from '../dto/payment-plan/create-payment-plan.dto';
import { PaymentPlanQueryFiltersDto } from '../dto/payment-plan/payment-plan-query-filters.dto';
import { UpdatePaymentPlanDto } from '../dto/payment-plan/update-payment-plan.dto';
import { PaymentPlanService } from '../services/payment-plan.service';

@ApiTags('Payment Plan')
@Controller('payment-plan')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
export class PaymentPlanController {
  constructor(
    private readonly paymentPlanService: PaymentPlanService
  ) { }

  @Role(SCOPES.WRITE_PAYMENT_PLAN)
  @Post()
  async create(
    @Body() newPlan: CreatePaymentPlanDto,
    @GetUser('user_id') user_id: number,
  ) {
    newPlan.created_by_id = user_id;
    return this.paymentPlanService.createPaymentPlan(newPlan);
  }

  @Get()
  @Role(SCOPES.READ_PAYMENT_PLAN)
  async findAll(@Query(new ValidationPipe({ transform: true })) query: PaymentPlanQueryFiltersDto) {

    query = parseQueryObj(query, ['product_id', 'is_active']);

    return this.paymentPlanService.findAll(query);
  }

  @Role(SCOPES.READ_PAYMENT_PLAN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paymentPlanService.findById(id);
  }

  @Put(':id')
  @Role(SCOPES.MODIFY_PRODUCT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('user_id') userId: number,
    @Body() updateProduct: UpdatePaymentPlanDto
  ) {
    updateProduct.updated_by_id = userId;
    return this.paymentPlanService.update(id, updateProduct);
  }

  @Role(SCOPES.ACTIVATE_PAYMENT_PLAN)
  @Patch('activate/:id')
  async activate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paymentPlanService.acDeactivatePaymentPlan(id, true);
  }

  @Role(SCOPES.DEACTIVATE_PAYMENT_PLAN)
  @Patch('deactivate/:id')
  async deactivate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paymentPlanService.acDeactivatePaymentPlan(id, false);
  }

}
