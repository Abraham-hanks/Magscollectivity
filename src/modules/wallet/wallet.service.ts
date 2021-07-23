import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions, Op } from 'sequelize';
import { WalletModel as Wallet } from './wallet.model';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { pagingParser } from 'src/common/utils/paging-parser';
import { ADMIN_WALLETS, CreditDebitRes, WalletAttributesExclude, WALLET_REPOSITORY } from './constants';
import { NewWalletDto } from './dto/new-wallet.dto';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { CustomerModel } from 'src/modules/customer/models/customer.model';

@Injectable()
export class WalletService {

  constructor(
    @Inject(WALLET_REPOSITORY) private readonly walletRepo: typeof Wallet,
  ) { }

  async create(newWallet: NewWalletDto, transactionHost: any): Promise<Wallet> {
    return this.walletRepo.create(newWallet, transactionHost);
  }

  async findAll(params): Promise<FindAllQueryInterface<Wallet>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at']
      },
      where: {
        ...params.where
      }
    };

    const wallets = await this.walletRepo.findAndCountAll(query);
    const paging = pagingParser(query, wallets.count, wallets.rows.length);

    return {
      paging,
      rows: wallets.rows
    };
  }

  async findOne(params, throwNotFoundError = true): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({
      where: params,
      attributes: {
        exclude: WalletAttributesExclude
      },
      include: [
        {
          model: CustomerModel,
          attributes: { exclude: DefaultQueryAttributeExclude },
        }
      ]
    });
    
    if (!wallet && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.WalletNotFound);

    return wallet;
  }

  async findById(id: number): Promise<Wallet> {
    const wallet = await this.walletRepo.findByPk(id,
      {
        attributes: {
          exclude: WalletAttributesExclude
        },
        include: [
          {
            model: CustomerModel,
            attributes: { exclude: ['deleted_at'] },
          }
        ]
      });

    if (!wallet)
      throw new BadRequestException(ERROR_MESSAGES.WalletNotFound);

    return wallet;
  }

  // don't call from controller!
  async getAdminWallets(): Promise<any> {
    // const result = [];
    const walletObj = {};
    const walletArray = Object.values(ADMIN_WALLETS);

    const query = {
      where: {
        is_admin_wallet: true,
        name: { [Op.in]: walletArray }
      }
    };
    const wallets = await this.findAll(query);

    if (!wallets || wallets.rows.length !== walletArray.length)
      throw new BadRequestException(ERROR_MESSAGES.AdminWalletsNotFound);
    
    for (let i = 0; i < walletArray.length; i++) {
      const walletName = walletArray[i];

      walletObj[walletName] = wallets.rows.find(wallet => wallet.name == walletName).id;
    }
    return walletObj;
  }

  async acDeactivateWallet(id: number, activate: boolean): Promise<Wallet> {
    const wallet = await this.findById(id);

    if (activate && wallet.is_active)
      throw new BadRequestException(ERROR_MESSAGES.WalletAlreadyActive);

    if (!activate && !wallet.is_active)
      throw new BadRequestException(ERROR_MESSAGES.WalletAlreadyDeactivated);

    wallet.is_active = activate;
    return wallet.save();
  }

  // !!!!!!!!!!!!!!!
  // The following methods should only be called from Job Queue Processors

  async credit(id: number, amount: number, transactionHost: any): Promise<CreditDebitRes> {
    const wallet = await this.walletRepo.findByPk(id);
    const oldBal = wallet.balance;

    const bal = parseInt(wallet.balance);

    if (!wallet.is_active)
      throw new BadRequestException(ERROR_MESSAGES.WalletNotActive);

    wallet.balance = (bal + amount).toString();

    await wallet.save(transactionHost);

    
    return {
      oldBal,
      newBal: wallet.balance,
      customer_id: wallet.customer_id,
      isAdminWallet: wallet.is_admin_wallet,
    }
  }


  async debit(id: number, amount: number, transactionHost): Promise<CreditDebitRes> {
    const wallet = await this.findById(id);
    const oldBal = wallet.balance;

    const bal = parseInt(wallet.balance);

    if (!wallet.is_active)
      throw new BadRequestException(ERROR_MESSAGES.WalletNotActive);

    if (bal < amount)
      throw new BadRequestException(ERROR_MESSAGES.InsufficientWalletBal);

    wallet.balance = (bal - amount).toString();

    await wallet.save(transactionHost);

    return {
      oldBal,
      newBal: wallet.balance,
      customer_id: wallet.customer_id
    }
  }
}
