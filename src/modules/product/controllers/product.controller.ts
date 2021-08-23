import { Body, Controller, Get, Header, Param, ParseIntPipe, Patch, Post, Put, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProductService } from '../services/product.service';
import { Role } from '../../auth/decorator/role.decorator';
import { SCOPES } from 'src/common/auth/scopes';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CreateProductDto } from '../dto/product/create-product.dto';
import { ProductQueryFiltersArr, ProductQueryFiltersDto } from '../dto/product/product-query-filters.dto';
import { GetUser } from 'src/modules/auth/decorator/user.decorator';
import * as csvWriter from 'csv-write-stream';
import { CountQueryResponse } from 'src/common/interface/find-query.interface';
import { UpdateProductDto } from '../dto/product/update-product.dto';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';

@ApiTags('Product')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
@Controller('product')
export class ProductController {

  constructor(
    private readonly productService: ProductService,
  ) { }

  @Post()
  @Role(SCOPES.WRITE_PRODUCT)
  async create(
    @Body() newProduct: CreateProductDto,
    @GetUser('user_id') user_id: number,
  ) {

    newProduct.created_by_id = user_id;
    return this.productService.create(newProduct);
  }

  @Get()
  @Role(SCOPES.READ_PRODUCT)
  async findAll(@Query() query: ProductQueryFiltersDto,
  ) {
    query = parseQueryObj(query, ProductQueryFiltersArr);

    return this.productService.findAll(query);
  }

  @Get('count')
  @Role(SCOPES.READ_PRODUCT)
  @ApiResponse({ type: CountQueryResponse })
  async getCount(@Query() query: ProductQueryFiltersDto) {

    query = parseQueryObj(query, ProductQueryFiltersArr);

    return {
      count: await this.productService.getCount(query)
    }
  }

  @Role(SCOPES.IS_ADMIN)
  @Get('total-units-sold')
  async getTotalUnitsSold(
  ) {
    return this.productService.getTotalUnitsSold();
  }

  @Get('csv')
  @Role(SCOPES.READ_PRODUCT)
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename=products.csv')
  async getReport(
    @Res() res: Response,
    @Query() queryFilter: ProductQueryFiltersDto
  ) {
    const query = parseQueryObj(queryFilter, ProductQueryFiltersArr);

    const writer = csvWriter({
      headers:
        [
          "name", "description", "address", "state_name", "lga_name", "unit_price", "total_units",
          "available_units", "can_cancel_subscription", "can_pause_subscription", "size_per_unit",
          "shd_pay_commission", "status", "is_active", "created_by_id", "updated_by_id",
          "created_at", "updated_at"
        ]
    });

    const productStream = await this.productService.getStream(query);
    writer.pipe(res);

    productStream.on('data', (chunk) => {
      writer.write(chunk);
    });

    productStream.on('end', () => {
      writer.end()
    });
  }

  @Role(SCOPES.READ_PRODUCT)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productService.findById(id);
  }

  @Put(':id')
  @Role(SCOPES.MODIFY_PRODUCT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('user_id') userId: number,
    @Body() updateProduct: UpdateProductDto
  ) {
    updateProduct.updated_by_id = userId;
    return this.productService.update(id, updateProduct);
  }

  @Role(SCOPES.ACTIVATE_PRODUCT)
  @Patch('activate/:id')
  async activate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productService.acDeactivateProduct(id, true);
  }

  @Role(SCOPES.DEACTIVATE_PRODUCT)
  @Patch('deactivate/:id')
  async deactivate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productService.acDeactivateProduct(id, false);
  }
}
