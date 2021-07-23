import { BadRequestException, Controller, Get, Param, ParseIntPipe, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/user.decorator';
import { SCOPES } from 'src/common/auth/scopes';
import { RoleGuard } from '../auth/guards/role.guard';
import { WalletQueryFiltersDto } from './dto/wallet-query-filters.dto';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { Role } from '../auth/decorator/role.decorator';
import { AuthObj } from '../auth/constants';
import { ROLE_NAMES } from '../role/constants';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';


@ApiTags('Wallet')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Get()
  @Role(SCOPES.READ_WALLET)
  async findAll(
    @Query() query: WalletQueryFiltersDto,
  ) {
    query = parseQueryObj(query, ['customer_id']);

    return this.walletService.findAll(query);
  }

  @Get('my-wallet')
  @Role(SCOPES.READ_WALLET)
  async getMyWallet(
    @GetUser() authObj: AuthObj
  ) {
    const { user_id, role_name } = authObj;

    if (!(role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor))
      throw new BadRequestException(ERROR_MESSAGES.UserMustBeCustomerOrRealtor)

    return this.walletService.findOne({
      customer_id: user_id
    });
  }

  @Get('admin-wallets')
  @Role(SCOPES.READ_ADMIN_WALLET)
  async getAdminWallets(
  ) {
    const query = parseQueryObj({});
    query.where = {
      is_admin_wallet: true
    };

    return this.walletService.findAll(query)
  }

  @Role(SCOPES.READ_WALLET)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.walletService.findById(id);
  }

  @Role(SCOPES.ACTIVATE_WALLET)
  @Put('activate/:id')
  async activate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.walletService.acDeactivateWallet(id, true);
  }

  @Role(SCOPES.DEACTIVATE_WALLET)
  @Put('deactivate/:id')
  async deactivate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.walletService.acDeactivateWallet(id, false);
  }
}
