import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CustomerModel as Customer } from '../models/customer.model';
import { CustomerAttributeIncludeFields, CUSTOMER_REPOSITORY } from '../constants';
import { CreateCustomerDto, CreateRealtorDto } from '../dto/customer/create-customer.dto';
import { pagingParser } from 'src/common/utils/paging-parser';
import { FindOptions, Op } from 'sequelize';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { WalletService } from '../../wallet/wallet.service';
import { WalletModel } from '../../wallet/wallet.model';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { UpdateCustomerDto } from '../dto/customer/update-customer.dto';
import { StateService } from '../../utility/services/state.service';
import { BankAccountModel } from '../../payment/models/bank-account.model';
import { LgaService } from 'src/modules/utility/services/lga.service';
import { RealtorTreeModel } from '../models/realtor-tree.model';
import { RealtorTreeService } from './realtor-tree.service';
import { AuthModel } from 'src/modules/auth/auth.model';
import { AuthAttributeIncludeFields } from 'src/modules/auth/constants';
import { WalletAttributesExclude } from 'src/modules/wallet/constants';
import { BankAccAtrributesExclude } from 'src/modules/payment/constants';
import { Readable } from 'stream';


@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY) private readonly customerRepo: typeof Customer,
    private readonly stateService: StateService,
    private readonly lgaService: LgaService,
    @Inject(forwardRef(() => RealtorTreeService)) private readonly realtorTreeService: RealtorTreeService,
    private readonly walletService: WalletService
  ) { }

  async create(newCustomer: CreateCustomerDto | CreateRealtorDto, transactionHost: any): Promise<Customer> {

    // create customer
    const createdCustomer = await this.customerRepo.create(newCustomer, transactionHost);

    // create wallet
    createdCustomer.wallet_id = (await this.walletService.create({ customer_id: createdCustomer.id }, transactionHost)).id;

    // save customer with wallet_id included
    return createdCustomer.save(transactionHost);
  }

  async findAll(params): Promise<FindAllQueryInterface<Customer>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at', 'updated_at', 'password']
      },
      where: {
        ...params.where
      },
      include: [
        {
          model: RealtorTreeModel,
          attributes: { exclude: DefaultQueryAttributeExclude },
        },
      ]
    };

    // search
    if (params.search) {
      params.search = '%' + params.search + '%';

      query.where[Op.or] = {
        'firstname': {
          [Op.iLike]: params.search
        },
        'lastname': {
          [Op.iLike]: params.search
        },
        'middlename': {
          [Op.iLike]: params.search
        },
        'email': {
          [Op.iLike]: params.search
        },
        'phone': {
          [Op.iLike]: params.search
        },
        'state_name': {
          [Op.iLike]: params.search
        },
        'lga_name': {
          [Op.iLike]: params.search
        },
      }
    }

    const customers = await this.customerRepo.findAndCountAll(query);
    const paging = pagingParser(query, customers.count, customers.rows.length);

    return {
      paging,
      rows: customers.rows
    };
  }

  async findById(id: number, throwNotFoundError = true): Promise<Customer> {
    const customer = await this.customerRepo.findByPk(id,
      {
        attributes: { exclude: DefaultQueryAttributeExclude },
        // include: [{ all: true, nested: true }]
        include: [
          {
            model: AuthModel,
            attributes: AuthAttributeIncludeFields,
          },
          {
            model: BankAccountModel,
            attributes: { exclude: BankAccAtrributesExclude },
          },
          // include upline = referred_by
          {
            model: Customer,
            as: 'upline',
            attributes: CustomerAttributeIncludeFields,
            include: [
              {
                model: Customer,
                as: 'upline',
                attributes: CustomerAttributeIncludeFields,
              }
            ],
          },
          // include downline = referred
          {
            model: Customer,
            as: 'downline',
            attributes: CustomerAttributeIncludeFields,
            include: [
              {
                model: Customer,
                as: 'downline',
                attributes: CustomerAttributeIncludeFields,
                include: [
                  {
                    model: Customer,
                    as: 'downline',
                    attributes: CustomerAttributeIncludeFields,
                    where: {
                      is_realtor: true
                    },
                    required: false,
                    include: [
                      {
                        model: Customer,
                        as: 'downline',
                        attributes: CustomerAttributeIncludeFields,
                        where: {
                          is_realtor: true
                        },
                        required: false,
                        include: [
                          {
                            model: Customer,
                            as: 'downline',
                            attributes: CustomerAttributeIncludeFields,
                            where: {
                              is_realtor: true
                            },
                            required: false,
                          },
                        ],
                      },
                    ],
                  },
                ],
                where: {
                  is_realtor: true
                },
                required: false
              },
            ],
            where: {
              is_realtor: true
            },
            required: false
          },
          // include clients_referred
          {
            model: Customer,
            as: 'clients',
            attributes: CustomerAttributeIncludeFields,
            where: {
              is_realtor: false
            },
            required: false
          },
          // include realtor tree
          {
            model: RealtorTreeModel,
            attributes: { exclude: DefaultQueryAttributeExclude },
          },
          // include wallet
          {
            model: WalletModel,
            attributes: { exclude: WalletAttributesExclude },
          }
        ]
      });

    if (!customer && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.CustomerNotFound);

    return customer;
  }

  async findOne(params, throwNotFoundError = true): Promise<Customer> {
    const customer = await this.customerRepo.findOne(
      {
        where: params,
        attributes: { exclude: DefaultQueryAttributeExclude },
        include: [
          {
            model: AuthModel,
            attributes: AuthAttributeIncludeFields,
          },
          {
            model: BankAccountModel,
            attributes: { exclude: BankAccAtrributesExclude },
          },
          // include upline = referred_by
          {
            model: Customer,
            as: 'upline',
            attributes: CustomerAttributeIncludeFields,
            include: [
              // {
              //   model: RealtorTreeModel,
              //   attributes: { exclude: DefaultQueryAttributeExclude },
              // },
              {
                model: Customer,
                as: 'upline',
                attributes: CustomerAttributeIncludeFields,
              }
            ],
          },
          // include downline = referred
          {
            model: Customer,
            as: 'downline',
            attributes: CustomerAttributeIncludeFields,
            include: [
              {
                model: Customer,
                as: 'downline',
                attributes: CustomerAttributeIncludeFields,
                include: [
                  {
                    model: Customer,
                    as: 'downline',
                    attributes: CustomerAttributeIncludeFields,
                    where: {
                      is_realtor: true
                    },
                    required: false,
                    include: [
                      {
                        model: Customer,
                        as: 'downline',
                        attributes: CustomerAttributeIncludeFields,
                        where: {
                          is_realtor: true
                        },
                        required: false,
                        include: [
                          {
                            model: Customer,
                            as: 'downline',
                            attributes: CustomerAttributeIncludeFields,
                            where: {
                              is_realtor: true
                            },
                            required: false,
                          },
                        ],
                      },
                    ],
                  },
                ],
                where: {
                  is_realtor: true
                },
                required: false
              },
            ],
            where: {
              is_realtor: true
            },
            required: false
          },
          // include clients_referred
          {
            model: Customer,
            as: 'clients',
            attributes: CustomerAttributeIncludeFields,
            where: {
              is_realtor: false
            },
            required: false
          },
          // include wallet
          {
            model: WalletModel,
            attributes: { exclude: WalletAttributesExclude },
          }
        ]
      });

    if (!customer && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.CustomerNotFound);

    return customer;
  }

  async validateReferralCode(referralCode): Promise<Customer> {
    return this.customerRepo.findOne({
      where: {
        phone: referralCode,
        is_realtor: true
      },
      attributes: ['firstname', 'lastname'],

    });
  }

  async getCount(params): Promise<number> {
    const count = await this.customerRepo.count({
      where: params.where
    });

    return count;
  }

  getStream(params) {
    const customerRepo = this.customerRepo;

    let maxPage: number;
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

      const readNextChunk = function () {
        query.page++;
        query.skip = (query.page - 1) * query.limit;

        if (query.page > maxPage) {
          stream.push(null);  // close stream
          return;
        }

        return customerRepo.findAll(query)
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
      // call sentry here
      console.log('err: ' + err);
    }
  }

  async update(id: number, updateCustomer: UpdateCustomerDto): Promise<Customer> {

    const customer = await this.findById(id);

    if (updateCustomer.state_id)
      updateCustomer.state_name = (await this.stateService.findById(updateCustomer.state_id)).name;

    if (updateCustomer.lga_id)
      updateCustomer.lga_name = (await this.lgaService.findById(updateCustomer.lga_id)).name;


    return customer.update(updateCustomer);
  }

}
