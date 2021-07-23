import { Controller, Delete, Get, Param, ParseIntPipe, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SCOPES } from 'src/common/auth/scopes';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Role } from 'src/modules/auth/decorator/role.decorator';
import { CardAuthService } from '../services/card-auth.service';
import { CardAuthQueryFiltersArray, CardAuthQueryFiltersDto } from '../dto/card-auth-query-filters.dto';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';

@ApiTags('Card Auth')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
@Controller('card-auth')
export class CardAuthController {
  constructor(private readonly cardAuthService: CardAuthService) {}

  @Get()
  @Role(SCOPES.READ_CARD_AUTH)
  async findAll(@Query() query: CardAuthQueryFiltersDto,
  ) {
    query = parseQueryObj(query, CardAuthQueryFiltersArray);

    return this.cardAuthService.findAll(query);
  }

  @Role(SCOPES.READ_CARD_AUTH)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cardAuthService.findById(id);
  }

  @Role(SCOPES.MODIFY_CARD_AUTH)
  @Delete(':id')
  async deleteCardAuth( @Param('id', ParseIntPipe) id: number) {
    return this.cardAuthService.deleteCardAuth(id);
  }

  @Role(SCOPES.ACTIVATE_CARD_AUTH)
  @Put('activate/:id')
  async activate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cardAuthService.acDeactivateCardAuth(id, true);
  }

  @Role(SCOPES.DEACTIVATE_CARD_AUTH)
  @Put('deactivate/:id')
  async deactivate(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cardAuthService.acDeactivateCardAuth(id, false);
  }
}
