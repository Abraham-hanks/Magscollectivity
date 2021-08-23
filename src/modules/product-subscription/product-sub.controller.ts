import { Body, Header, Param, ParseIntPipe, Patch, Post, Query, Res, UseInterceptors } from '@nestjs/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductSubscriptionService } from './product-sub.service';
import { ProductSubQueryFiltersArr, ProductSubQueryFiltersDto } from './dto/product-sub-query-filters.dto';
import { Role } from '../auth/decorator/role.decorator';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { SCOPES } from 'src/common/auth/scopes';
import { GetUser } from '../auth/decorator/user.decorator';
import { CreateProductSubDto } from './dto/create-product-sub.dto';
import { ROLE_NAMES } from '../role/constants';
import { AuthObj } from '../auth/constants';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import * as csvWriter from 'csv-write-stream';
import { Response } from 'express';
import { AllocateProductSubDto } from './dto/allocate-product-sub.dto';


@ApiTags('Product Subscription')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
@Controller('product-subscription')
export class ProductSubController {
  constructor(
    private readonly productSubService: ProductSubscriptionService,
  ) { }

  @Post()
  @Role(SCOPES.WRITE_PRODUCT_SUBSCRIPTION)
  async create(
    @Body() newSub: CreateProductSubDto,
    @GetUser('user_id') userId: number,
  ) {
    newSub.customer_id = userId;
    return this.productSubService.create(newSub);
  }

  @Get()
  @Role(SCOPES.READ_PRODUCT_SUBSCRIPTION)
  async findAll(
    @Query() query: ProductSubQueryFiltersDto,
    @GetUser() { role_name, user_id }: AuthObj
  ) {

    query = parseQueryObj(query, ProductSubQueryFiltersArr);

    if (role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor)
      query.where.customer_id = user_id;

    return this.productSubService.findAll(query);
  }

  @Get('count')
  @Role(SCOPES.READ_PRODUCT_SUBSCRIPTION)
  async count(
    @Query() query: ProductSubQueryFiltersDto,
    @GetUser() { role_name, user_id }: AuthObj
  ) {

    query = parseQueryObj(query,
      [
        'customer_id', 'product_id', 'status'
      ]);

    if (role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor)
      query.where.customer_id = user_id;

    const count = await this.productSubService.getCount(query);
    return {
      count
    };
  }

  @Get('csv')
  @Role(SCOPES.IS_ADMIN)
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename=product-subscriptions.csv')
  async getReport(
    @Res() res: Response,
    @Query() query: ProductSubQueryFiltersDto,
  ) {
    query = parseQueryObj(query, ProductSubQueryFiltersArr);

    const writer = csvWriter({
      headers:
        [
          "customer_id", "units", "total_amount", "amount_paid", "amount_left", "amount_per_unit", "is_installment",
          "duration", "start_date", "end_date", "next_deduction_date",
          "product_id", "payment_plan_id", "is_discounted", "discounted_percentage", "discounted_price",
           "status", "created_at", "updated_at",// "property_type",
        ]
    });

    const productSubStream = await this.productSubService.getStream(query);
    writer.pipe(res);

    productSubStream.on('data', (chunk) => {
      writer.write(chunk);
    });

    productSubStream.on('end', () => {
      writer.end();
    });
  }

  @Role(SCOPES.READ_PRODUCT_SUBSCRIPTION)
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

    return this.productSubService.findOne(params);
  }

    // this is used for property allocation
    @Patch('allocate/:id')
    @Role(SCOPES.IS_ADMIN)
    async allocateProperty(
      @Param('id', ParseIntPipe) id: number,
      @GetUser('user_id') userId: number,
      @Body() updateProductSub: AllocateProductSubDto
    ) {
      updateProductSub.updated_by_id = userId;
      return this.productSubService.allocateProperty(id, updateProductSub);
    }

}
