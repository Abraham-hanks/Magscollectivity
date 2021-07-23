import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { WithdrawalRequestService } from '../services/withdrawal-request.service';
import { WithdrawalRequestModel as WithdrawalRequest } from '../models/withdrawal-request.model';
import { ApproveWithdrawalRequestDto, CreateWithdrawalRequestDto, DeclineWithdrawalRequestDto, WithdrawalRequestQueryFiltersArray, WithdrawalRequestQueryFiltersDto } from '../dto/withdrawal-request/withdrawal-request.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorator/user.decorator';
import { AuthObj } from '../../auth/constants';
import { ROLE_NAMES } from '../../role/constants';
import { SCOPES } from 'src/common/auth/scopes';
import { Role } from '../../auth/decorator/role.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';


@ApiTags('Withdrawal Request')
@Controller('withdrawal-request')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
export class WithdrawalRequestController {
  constructor(private readonly withdrawalRequestService: WithdrawalRequestService) { }

  @Post()
  @Role(SCOPES.WRITE_WITHDRAWAL_REQUEST)
  async create(
    @Body() newWithdrawalRequest: CreateWithdrawalRequestDto,
    @GetUser('user_id') customerId: number
  ) {

    newWithdrawalRequest.customer_id = customerId;
    return this.withdrawalRequestService.create(newWithdrawalRequest);
  }

  @Role(SCOPES.READ_WITHDRAWAL_REQUEST)
  @Get()
  @ApiResponse({ type: WithdrawalRequest })
  async findAll(
    @Query() query: WithdrawalRequestQueryFiltersDto,
    @GetUser() user: AuthObj,
  ) {

    const queryObj = parseQueryObj(query, WithdrawalRequestQueryFiltersArray);

    const { user_id, role_name } = user;
    if (role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor)
      queryObj.where.customer_id = user_id;

    return this.withdrawalRequestService.findAll(queryObj);
  }


  @Role(SCOPES.READ_WITHDRAWAL_REQUEST)
  @Get('count')
  async count(
    @Query() query: WithdrawalRequestQueryFiltersDto,
    @GetUser() { user_id, role_name }: AuthObj,
  ) {

    const queryObj = parseQueryObj(query, WithdrawalRequestQueryFiltersArray);

    if (role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor)
      queryObj.where.customer_id = user_id;

    const count = await this.withdrawalRequestService.getCount(queryObj);
    return {
      count
    };
  }

  @Role(SCOPES.READ_WITHDRAWAL_REQUEST)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { user_id, role_name }: AuthObj,
  ) {

    const params: any = {
      id
    };

    if (role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor)
      params.customer_id = user_id;

    return this.withdrawalRequestService.findOne(params);
  }


  @Role(SCOPES.ACTIVATE_WITHDRAWAL_REQUEST)
  @Patch('approve')
  async activate(
    @Body() approveWithdrawalRequestDto: ApproveWithdrawalRequestDto,
    @GetUser('user_id') adminId: number
  ) {
    approveWithdrawalRequestDto.updated_by_id = adminId;

    return this.withdrawalRequestService.approve(approveWithdrawalRequestDto);
  }

  @Role(SCOPES.DEACTIVATE_WITHDRAWAL_REQUEST)
  @Patch('decline')
  async deactivate(
    @Body() declineWithdrawalRequestDto: DeclineWithdrawalRequestDto,
    @GetUser('user_id') adminId: number
  ) {
    declineWithdrawalRequestDto.updated_by_id = adminId;

    return this.withdrawalRequestService.decline(declineWithdrawalRequestDto);
  }
}
