import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { FindAllQueryInterface } from "src/common/interface/find-query.interface";
import { ERROR_MESSAGES } from "src/common/utils/error-messages";
import { pagingParser } from "src/common/utils/paging-parser";
import { CustomerService } from "src/modules/customer/services/customer.service";
import { BankAccAtrributesExclude, BANK_ACCOUNT_REPOSITORY, NewReceipient } from "../constants";
import { CreateBankAccountDto } from "../dto/bank-account/create-bank-account.dto";
import { BankAccountModel as BankAccount } from "../models/bank-account.model";
import { PaystackService } from "./paystack.service";


@Injectable()
export class BankAccountService {
  constructor(
    @Inject(BANK_ACCOUNT_REPOSITORY) private readonly bankAccountRepo: typeof BankAccount,
    @Inject(forwardRef(() => CustomerService)) private readonly customerService: CustomerService,
    private readonly paystackService: PaystackService
  ) { }

  async create(newBankAcc: CreateBankAccountDto): Promise<BankAccount> {

    // check if bankAccount exists
    const existingBankAcc = await this.findOne({
      customer_id: newBankAcc.customer_id,
    }, false);

    if (existingBankAcc)
      throw new BadRequestException(ERROR_MESSAGES.BankAccountAlreadyAdded);

    // verify bank account
    const { status, ...verifyAccRes } = await this.paystackService.verifyBankAccount(newBankAcc);

    // create receipient
    const { firstname, lastname } = await this.customerService.findById(newBankAcc.customer_id);
    const newReceipient: NewReceipient = {
      name: `${firstname} ${lastname}`,
      ...newBankAcc
    };
    const { recipient_code } = await this.paystackService.createTransferReceipient(newReceipient);

    newBankAcc.account_name = verifyAccRes.account_name;
    newBankAcc.recipient_code = recipient_code;

    return this.bankAccountRepo.create(newBankAcc);
  }

  async findById(id: number, throwNotFoundError = true): Promise<BankAccount> {
    const bankAccount = await this.bankAccountRepo.findByPk(id,
      {
        attributes: {
          exclude: BankAccAtrributesExclude,
        },
      }
    );

    if (!bankAccount && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.BankAccountNotFound);

    return bankAccount;
  }

  async findOne(params, throwNotFoundError = true): Promise<BankAccount> {
    const bankAccount = await this.bankAccountRepo.findOne(
      {
        where: params,
        attributes: {
          exclude: BankAccAtrributesExclude,
        },
      });

    if (!bankAccount && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.BankAccountNotFound);

    return bankAccount;
  }

  async findAll(params): Promise<FindAllQueryInterface<BankAccount>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: BankAccAtrributesExclude
      },
      where: {
        ...params.where
      }
    };

    const bankAccount = await this.bankAccountRepo.findAndCountAll(query);
    const paging = pagingParser(query, bankAccount.count, bankAccount.rows.length);

    return {
      paging,
      rows: bankAccount.rows
    };
  }

  // async acDeactivate(id: number, activate: boolean): Promise<BankAccount> {
  //   const bankAccount = await this.findById(id);

  //   if (activate && bankAccount.is_active)
  //     throw new BadRequestException(ERROR_MESSAGES.BankAccountAlreadyActive);

  //   if (!activate && !bankAccount.is_active)
  //     throw new BadRequestException(ERROR_MESSAGES.BankAccountAlreadyDeactivated);

  //   bankAccount.is_active = activate;
  //   return bankAccount.save();
  // }

  async update(updateBankAcc: CreateBankAccountDto): Promise<BankAccount> {
    const bankAccount = await this.findOne({
      customer_id: updateBankAcc.customer_id
    });

    if (updateBankAcc.account_number === bankAccount.account_number && updateBankAcc.bank_code === bankAccount.bank_code) 
      throw new BadRequestException(ERROR_MESSAGES.BankAccountAlreadyAdded);
    
    // verify bank account
    const { status, ...verifyAccRes } = await this.paystackService.verifyBankAccount(updateBankAcc);

    // create receipient
    const { firstname, lastname } = await this.customerService.findById(updateBankAcc.customer_id);
    const newReceipient: NewReceipient = {
      name: `${firstname} ${lastname}`,
      ...updateBankAcc
    };
    const { recipient_code } = await this.paystackService.createTransferReceipient(newReceipient);

  
    bankAccount.account_number = updateBankAcc.account_number;
    bankAccount.account_name = verifyAccRes.account_name;
    bankAccount.bank_code = updateBankAcc.bank_code;
    bankAccount.bank_name = updateBankAcc.bank_name;
    bankAccount.recipient_code = recipient_code;

    return bankAccount.save();
  }

}

