import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Query, Put, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SCOPES } from 'src/common/auth/scopes';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { Role } from '../auth/decorator/role.decorator';
import { GetUser } from '../auth/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ChangeRequestService } from './change-request.service';
import { ChangeRequestQueryFiltersArray, ChangeRequestQueryFiltersDto } from './dto/change-request-query-filters.dto';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { UpdateChangeRequestStatus } from './dto/update-change-request.dto';

@ApiTags('Change Request')
@Controller('change-request')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
export class ChangeRequestController {
  constructor(private readonly changeRequestService: ChangeRequestService) { }

  @Role(SCOPES.WRITE_CHANGE_REQUEST)
  @Post()
  async create(
    @Body() newRequest: CreateChangeRequestDto,
    @GetUser("user_id") user_id: number,
  ) {

    newRequest.customer_id = user_id;
    return this.changeRequestService.create(newRequest);
  }

  @Role(SCOPES.READ_CHANGE_REQUEST)
  @Get()
  async findAll(
    @Query() query: ChangeRequestQueryFiltersDto
  ) {

    query = parseQueryObj(query, ChangeRequestQueryFiltersArray);
    return this.changeRequestService.findAll(query);
  }

  @Role(SCOPES.READ_CHANGE_REQUEST)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.changeRequestService.findById(id);
  }

  @Role(SCOPES.MODIFY_CHANGE_REQUEST)
  @Put('approve/:id')
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @GetUser("user_id") user_id: number,
    @Body() updateChangeReqStatus: UpdateChangeRequestStatus
  ) {

    updateChangeReqStatus.admin_id = user_id;
    return this.changeRequestService.setRequestApproval(id, updateChangeReqStatus, true);
  }

  @Role(SCOPES.MODIFY_CHANGE_REQUEST)
  @Put('disapprove/:id')
  async disapprove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser("user_id") user_id: number,
    @Body() updateChangeReqStatus: UpdateChangeRequestStatus
  ) {

    updateChangeReqStatus.admin_id = user_id;
    return this.changeRequestService.setRequestApproval(id, updateChangeReqStatus, false);
  }
}
