import { Body, Controller, Get, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SCOPES } from 'src/common/auth/scopes';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { Role } from 'src/modules/auth/decorator/role.decorator';
import { GetUser } from 'src/modules/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { CreateBankAccountDto } from '../dto/bank-account/create-bank-account.dto';
import { BankAccountService } from '../services/bank-account.service';
import { PaystackService } from '../services/paystack.service';


@ApiTags('Bank Account')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
@Controller('bank-account')
export class BankAccountController {
  constructor(
    private readonly bankAccountService: BankAccountService,
    private readonly paystackService: PaystackService
  ) { }

  @Post()
  @Role(SCOPES.WRITE_BANK_ACCOUNT)
  async addBankAccount(
    @Body() newBankAccount: CreateBankAccountDto,
    @GetUser('user_id') userId: number,
  ) {
    newBankAccount.customer_id = userId;
    return this.bankAccountService.create(newBankAccount);
  }

  @Get()
  @Role(SCOPES.IS_CUSTOMER_OR_REALTOR)
  async findAll(
    @GetUser('user_id') userId: number,
  ) {
    const query = {
      where: {
        customer_id: userId
      }
    };

    return this.bankAccountService.findAll(query);
  }

  @Get('list-all-banks')
  async getBanksList() {
    return {
      banks: await this.paystackService.listBanks()
    };
  }

  @Role(SCOPES.MODIFY_BANK_ACCOUNT)
  @Put()
  async update(
    @Body() updateBankAcc: CreateBankAccountDto,
    @GetUser('user_id') userId: number,
  ) {
    updateBankAcc.customer_id = userId;
    return this.bankAccountService.update(updateBankAcc);
  }

}
