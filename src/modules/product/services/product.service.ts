import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProductModel as Product } from '../models/product.model';
import { PRODUCT_REPOSITORY } from '../constants';
import { CreateProductDto } from '../dto/product/create-product.dto';
import { pagingParser } from 'src/common/utils/paging-parser';
import { FindOptions, Op } from 'sequelize';
import { CountQueryResponse, FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { StateService } from '../../utility/services/state.service';
import { PaymentPlanModel } from '../models/payment-plan.model';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { AdminModel } from 'src/modules/admin/admin.model';
import { UpdateProductDto } from '../dto/product/update-product.dto';
import { Readable } from 'stream';
import { LgaService } from 'src/modules/utility/services/lga.service';


@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepo: typeof Product,
    private readonly stateService: StateService,
    private readonly lgaService: LgaService,
  ) { }


  async create(newProduct: CreateProductDto): Promise<Product> {

    if (newProduct.state_id)
      newProduct.state_name = (await this.stateService.findById(newProduct.state_id)).name;

    if (newProduct.lga_id)
      newProduct.lga_name = (await this.lgaService.findById(newProduct.lga_id)).name;

    newProduct.available_units = newProduct.total_units;

    return this.productRepo.create(newProduct);
  }

  async findAll(params): Promise<FindAllQueryInterface<Product>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at']
      },
      where: {
        ...params.where
      },
      include: [
        {
          model: PaymentPlanModel,
          attributes: {
            exclude: DefaultQueryAttributeExclude
          },
          // only retrieve active payment plans
          where: {
            is_active: true
          },
          required: false // return all parent instances
        },
      ]
    };

    // search
    if (params.search) {
      params.search = '%' + params.search + '%';

      query.where[Op.or] = {
        'name': {
          [Op.iLike]: params.search
        },
        'description': {
          [Op.iLike]: params.search
        },
        'address': {
          [Op.iLike]: params.search
        },
        'state_name': {
          [Op.iLike]: params.search
        },
        'lga_name': {
          [Op.iLike]: params.search
        },
        // 'features': {
        //   [Op.iLike]: params.search
        // },
        'property_type': {
          [Op.iLike]: params.search
        },
      }
    }

    const products = await this.productRepo.findAndCountAll(query);
    const paging = pagingParser(query, products.count, products.rows.length);

    return {
      paging,
      rows: products.rows
    };
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepo.findByPk(id,
      {
        attributes: { exclude: ['deleted_at'] },
        include: [
          {
            model: PaymentPlanModel,
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
            // where: {
            //   is_active: true
            // }
          },
          {
            model: AdminModel,
            as: 'created_by',
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
          },
          {
            model: AdminModel,
            as: 'updated_by',
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
          },
        ]
      });

    if (!product)
      throw new BadRequestException(ERROR_MESSAGES.ProductNotFound);

    return product;
  }

  async findOne(params): Promise<Product> {
    const product = await this.productRepo.findOne(
      {
        where: params,
        attributes: { exclude: ['deleted_at'] },
        include: [
          {
            model: PaymentPlanModel,
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
            where: {
              is_active: true
            }
          },
          {
            model: AdminModel,
            as: 'created_by',
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
          },
          {
            model: AdminModel,
            as: 'updated_by',
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
          },
        ]
      });

    if (!product)
      throw new BadRequestException(ERROR_MESSAGES.ProductNotFound);

    return product;
  }

  async getCount(params): Promise<number> {
    const count = await this.productRepo.count({
      where: params.where
    });
    return count;
  }


  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {

    const product = await this.findById(id);

    return product.update(updateProductDto);
  }


  getStream(params) {
    let maxPage;
    const query: any = {
      page: 0,
      limit: 100,
      order: params.order,
      attributes: {
        include: params.include || null,
        exclude: ['meta', 'created_by', 'updated_by', ...DefaultQueryAttributeExclude]
      },
      where: params.where
    }

    try {
      const stream = new Readable({
        objectMode: true,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        read() { }
      });

      const readNextChunk = () => {
        query.page++;
        query.skip = (query.page - 1) * query.limit;

        if (query.page > maxPage) {
          stream.push(null);  // close stream
          return;
        }
        return this.productRepo.findAll(query)
          .each((item) => {
            stream.push(item.toJSON())
          })
          .then(() => readNextChunk());
      }

      return this.getCount(query)
        .then((count) => {
          maxPage = (count < query.limit) ? 1 : Math.ceil(count / query.limit);
          return stream;
        })
        .finally(() => readNextChunk())
    }
    catch (err) {
      console.log('err: ' + err);
    }
  }

  async acDeactivateProduct(id: number, activate: boolean): Promise<Product> {
    const product = await this.findById(id);

    if (activate && product.is_active)
      throw new BadRequestException(ERROR_MESSAGES.ProductAlreadyActive);

    if (!activate && !product.is_active)
      throw new BadRequestException(ERROR_MESSAGES.ProductAlreadyDeactivated);

    product.is_active = activate;
    return product.save();
  }
}
