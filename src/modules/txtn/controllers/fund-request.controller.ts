import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { FundRequestService } from '../services/fund-request.service';
import { FundRequestModel as FundRequest } from '../models/fund-request.model';
import { ApproveFundRequestDto, CreateFundRequestDto, DeclineFundRequestDto, FundRequestQueryFiltersArray, FundRequestQueryFiltersDto } from '../dto/fund-request/fund-request.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorator/user.decorator';
import { AuthObj } from '../../auth/constants';
import { ROLE_NAMES } from '../../role/constants';
import { SCOPES } from 'src/common/auth/scopes';
import { Role } from '../../auth/decorator/role.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';


@ApiTags('Fund Request')
@Controller('fund-request')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
export class FundRequestController {
  constructor(private readonly fundRequestService: FundRequestService) { }

  @Post()
  @Role(SCOPES.WRITE_FUND_REQUEST)
  async create(
    @Body() newFundRequest: CreateFundRequestDto,
    @GetUser('user_id') customerId: number
  ) {

    newFundRequest.customer_id = customerId;
    return this.fundRequestService.create(newFundRequest);
  }


  @Role(SCOPES.READ_FUND_REQUEST)
  @Get()
  @ApiResponse({ type: FundRequest })
  async findAll(
    @Query() query: FundRequestQueryFiltersDto,
    @GetUser() user: AuthObj,
  ) {

    const queryObj = parseQueryObj(query, FundRequestQueryFiltersArray);

    const { user_id, role_name } = user;
    if (role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor)
      queryObj.where.customer_id = user_id;

    return this.fundRequestService.findAll(queryObj);
  }


  @Role(SCOPES.READ_FUND_REQUEST)
  @Get('count')
  async count(
    @Query() query: FundRequestQueryFiltersDto,
    @GetUser() { user_id, role_name }: AuthObj,
  ) {

    const queryObj = parseQueryObj(query, FundRequestQueryFiltersArray);

    if (role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor)
      queryObj.where.customer_id = user_id;

    const count = await this.fundRequestService.getCount(queryObj);
    return {
      count
    };
  }

  @Role(SCOPES.READ_FUND_REQUEST)
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

    return this.fundRequestService.findOne(params);
  }


  @Role(SCOPES.ACTIVATE_FUND_REQUEST)
  @Patch('approve')
  async activate(
    @Body() approveFundRequestDto: ApproveFundRequestDto,
    @GetUser('user_id') adminId: number
  ) {
    approveFundRequestDto.updated_by_id = adminId;

    return this.fundRequestService.approve(approveFundRequestDto);
  }

  @Role(SCOPES.DEACTIVATE_FUND_REQUEST)
  @Patch('decline')
  async deactivate(
    @Body() declineFundRequestDto: DeclineFundRequestDto,
    @GetUser('user_id') adminId: number
  ) {
    declineFundRequestDto.updated_by_id = adminId;

    return this.fundRequestService.decline(declineFundRequestDto);
  }
}
