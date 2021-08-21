import { Body, Header, Param, ParseIntPipe, Patch, Put, Query, Res, UseInterceptors } from '@nestjs/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/decorator/user.decorator';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CustomerService } from '../services/customer.service';
import { CustomerQueryFiltersArr, CustomerQueryFiltersDto } from '../dto/customer/customer-query-filters.dto';
import { Role } from '../../auth/decorator/role.decorator';
import { SCOPES } from 'src/common/auth/scopes';
import { RoleGuard } from '../../auth/guards/role.guard';
import { AuthService } from '../../auth/auth.service';
import { ROLE_NAMES } from '../../role/constants';
import { UpdateCustomerDto } from '../dto/customer/update-customer.dto';
import { CountQueryResponse } from 'src/common/interface/find-query.interface';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TxtnService } from 'src/modules/txtn/services/txtn.service';
import { TXTN_TYPE } from 'src/modules/txtn/constants';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import * as csvWriter from 'csv-write-stream';
import { Response } from 'express';


@ApiTags('Customer')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
    private readonly txtnService: TxtnService
  ) { }

  @Get()
  @Role(SCOPES.READ_CUSTOMER)
  async findAll(
    @Query() query: CustomerQueryFiltersDto,
  ) {
    query = parseQueryObj(query, CustomerQueryFiltersArr);

    return this.customerService.findAll(query);
  }

  @Get('count')
  @Role(SCOPES.READ_CUSTOMER)
  @ApiResponse({ type: CountQueryResponse })
  async getCount(
    @Query() query: CustomerQueryFiltersDto) {

    query = parseQueryObj(query, CustomerQueryFiltersArr);

    return {
      count: await this.customerService.getCount(query)
    }
  }

  @Role(SCOPES.IS_CUSTOMER_OR_REALTOR)
  @Get('profile')
  async myProfile(
    @GetUser('user_id') user_id: number,
  ) {

    return this.customerService.findById(user_id);
  }

  @Role(SCOPES.IS_REALTOR)
  @Get('total-commission')
  async totalCommission(
    @GetUser('user_id') customer_id: number,
  ) {

    const sum = await this.txtnService.getSum({
      type: TXTN_TYPE.commission,
      customer_id
    });
    
    return {
      sum
    };
  }

  @Get('csv')
  @Role(SCOPES.IS_ADMIN)
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename=customers.csv')
  async getReport(
    @Res() res: Response,
    @Query() queryParams: CustomerQueryFiltersDto
  ) {
    const query = parseQueryObj(queryParams, CustomerQueryFiltersArr);

    const writer = csvWriter({
      headers:
        [
          'firstname', 'lastname', 'middlename', 'phone', 'email', 'state_name', 'lga_name', 'dob', 'gender',
          'marital_status', 'address', 'country', 'referred_by_id', 
          'created_by_id', 'updated_by_id', 'created_at', 'updated_at',
          'next_of_kin_full_name', 'next_of_kin_phone', 'next_of_relationship', 'next_of_kin_address'
        ]
    });


    const customerStream = await this.customerService.getStream(query);
    writer.pipe(res);

    customerStream.on('data', (chunk) => {
      // chunk = lodash.merge(chunk, chunk.created_by);
      // delete chunk.created_by;

      writer.write(chunk);
    });

    customerStream.on('end', () => {
      writer.end();
    });
  }

  @Role(SCOPES.READ_CUSTOMER)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.customerService.findById(id);
  }

  @Role(SCOPES.IS_CUSTOMER_OR_REALTOR)
  @Put('profile')
  async update(
    @GetUser('user_id') userId: number,
    @Body() updateCustomer: UpdateCustomerDto
  ) {
    return this.customerService.update(userId, updateCustomer);
  }

  @Role(SCOPES.ACTIVATE_CUSTOMER)
  @Patch('activate/:id')
  async activate(
    @Param('id', ParseIntPipe) id: number,
  ) {

    // ROLE_NAMES.customer suffices for both customer and realtor
    return this.authService.acDeactivateUser(id, ROLE_NAMES.customer, true);
  }

  @Role(SCOPES.DEACTIVATE_CUSTOMER)
  @Patch('deactivate/:id')
  async deactivate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.authService.acDeactivateUser(id, ROLE_NAMES.customer, false);
  }
}
