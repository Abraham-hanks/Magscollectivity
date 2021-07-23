import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SCOPES } from 'src/common/auth/scopes';
import { AuditInterceptor } from 'src/common/interceptor/audit.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { AuthObj } from '../auth/constants';
import { Role } from '../auth/decorator/role.decorator';
import { GetUser } from '../auth/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ROLE_NAMES } from '../role/constants';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentQueryFiltersArray, DocumentQueryFiltersDto } from './dto/document-query-filters.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@ApiTags('Document')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(AuditInterceptor, TransformInterceptor)
@Controller('document')
export class DocumentController {
  constructor(
    private readonly docService: DocumentService,
  ) {}

  @Post()
  @Role(SCOPES.WRITE_DOCUMENT)
  async create(
    @Body() newDocument: CreateDocumentDto,
    @GetUser('user_id') user_id: number,
  ) {
    newDocument.created_by_id = user_id;
    return this.docService.create(newDocument);
  }

  @Get()
  @Role(SCOPES.READ_DOCUMENT)
  async findAll(
    @Query() query: DocumentQueryFiltersDto,
    @GetUser() authObj: AuthObj
  ) {

    const { user_id, role_name } = authObj;

    if (role_name == ROLE_NAMES.customer || role_name == ROLE_NAMES.realtor)
      query.customer_id = user_id;
      
    query = parseQueryObj(query, DocumentQueryFiltersArray);

    return this.docService.findAll(query);
  }

  @Role(SCOPES.READ_DOCUMENT)
  @Get(':id')
  async findOne( @Param('id', ParseIntPipe) id: number ) {
    return this.docService.findById(id);
  }

  @Post('send/:id')
  @Role(SCOPES.WRITE_DOCUMENT)
  async sendDocument( @Param('id', ParseIntPipe) id: number ) {
    return this.docService.sendDocument(id);
  }


  @Role(SCOPES.MODIFY_DOCUMENT)
  @Put(':id')
  async updateDocument(
    @Body() newUpdate: UpdateDocumentDto,
    @GetUser('user_id') user_id: number,
    @Param('id', ParseIntPipe) id: number
  ) {
    newUpdate.updated_by_id = user_id;
    return await this.docService.update(id, newUpdate);
  }
}
