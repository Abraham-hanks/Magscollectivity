import { Body, Controller, Get, Header, Param, ParseIntPipe, Post, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { TxtnService } from '../services/txtn.service';
import { TxtnModel as Txtn } from '../models/txtn.model';
import { TxtnQueryFiltersArray, TxtnQueryFiltersDto } from '../dto/txtn-query-filters.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorator/user.decorator';
import { AuthObj } from '../../auth/constants';
import { ROLE_NAMES } from '../../role/constants';
import { SCOPES } from 'src/common/auth/scopes';
import { Role } from '../../auth/decorator/role.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { FundWalletDto, ProductSubPurchaseDto } from '../dto/new-payment.dto';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import * as csvWriter from 'csv-write-stream';
import { Response } from 'express';


@ApiTags('Transaction')
@Controller('txtn')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
export class TxtnController {
  constructor(private readonly txtnService: TxtnService) { }

  @Role(SCOPES.READ_TRANSACTION)
  @Get()
  @ApiResponse({ type: Txtn })
  async findAll(
    @Query() query: TxtnQueryFiltersDto,
    @GetUser() user: AuthObj,
  ) {

    const queryObj = parseQueryObj(query, TxtnQueryFiltersArray);

    const { user_id, role_name } = user;
    if (role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor)
      queryObj.where.customer_id = user_id;

    return this.txtnService.findAll(queryObj);
  }


  @Role(SCOPES.READ_TRANSACTION)
  @Get('count')
  async count(
    @Query() query: TxtnQueryFiltersDto,
    @GetUser() user: AuthObj,
  ) {

    const queryObj = parseQueryObj(query, TxtnQueryFiltersArray);

    const { user_id, role_name } = user;
    if (role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor)
      queryObj.where.customer_id = user_id;

    const count = await this.txtnService.getCount(queryObj);
    return {
      count
    };
  }

  @Get('csv')
  @Role(SCOPES.IS_ADMIN)
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename=transactions.csv')
  async getReport(
    @Res() res: Response,
    @Query() queryFilter: TxtnQueryFiltersDto
  ) {
    const query = parseQueryObj(queryFilter, TxtnQueryFiltersArray);

    const writer = csvWriter({
      headers:
        [
          "total_amount", "charges", "type", "channel", "description", "reference", "wallet_id",
          "customer_id", "admin_id", "old_balance", "new_balance", "position", "status", "created_at"
        ]
    });

    const txtnStream = await this.txtnService.getStream(query);
    writer.pipe(res);

    txtnStream.on('data', (chunk) => {
      // chunk = lodash.merge(chunk, chunk.created_by);
      // delete chunk.created_by;

      writer.write(chunk);
    });

    txtnStream.on('close', () => {
      writer.end()
    });
  }

  @Role(SCOPES.READ_TRANSACTION)
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

    return this.txtnService.findOne(params);
  }


  @Post('fund-wallet')
  @Role(SCOPES.FUND_WALLET)
  async fundWallet(
    @Body() newTxtn: FundWalletDto,
    @GetUser('user_id') customerId: number
  ) {

    newTxtn.customer_id = customerId;
    return this.txtnService.fundWallet(newTxtn);
  }

  
  @Role(SCOPES.IS_CUSTOMER_OR_REALTOR)
  @Post('product-sub-payment')
  async productSubPayment(
    @Body() subPayment: ProductSubPurchaseDto,
    @GetUser('user_id') customerId: number
  ) {

    subPayment.customer_id = customerId;
    return this.txtnService.subscriptionPayment(subPayment);
  }
}
