import { Controller, Get, Header, Param, ParseIntPipe, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { AuditService } from '../services/audit.service';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { AuditQueryFiltersArray, AuditQueryFiltersDto } from '../dto/audit.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { SCOPES } from 'src/common/auth/scopes';
import { Role } from 'src/modules/auth/decorator/role.decorator';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import * as csvWriter from 'csv-write-stream';
import { Response } from 'express';

@ApiTags('Audit')
@Controller('audit')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Role(SCOPES.READ_AUDIT)
  async findAll(@Query() query: AuditQueryFiltersDto) {
    query = parseQueryObj(query, AuditQueryFiltersArray);
  
    return this.auditService.findAll(query);
  }

  @Get('csv')
  @Role(SCOPES.IS_ADMIN)
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename=audits.csv')
  async getReport(
    @Res() res: Response,
    @Query() queryFilter: AuditQueryFiltersDto
  ) {
    const query = parseQueryObj(queryFilter, AuditQueryFiltersArray);

    const writer = csvWriter({
      headers:
        [
          "label", "auth_id", "module", "request_body", "response_message", "status_code",
          "controller_method", "request_method", "request_url", "user_agent", "ip_address", "created_at"
        ]
    });

    const auditStream = await this.auditService.getStream(query);
    writer.pipe(res);

    auditStream.on('data', (chunk) => {
      // chunk = lodash.merge(chunk, chunk.created_by);
      // delete chunk.created_by;

      writer.write(chunk);
    });

    auditStream.on('close', () => {
      writer.end()
    });
  }

  @Get(':id')
  @Role(SCOPES.READ_AUDIT)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.auditService.findById(id);
  }
}
