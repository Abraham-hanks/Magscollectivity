/* eslint-disable @typescript-eslint/no-empty-function */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { pagingParser } from 'src/common/utils/paging-parser';
import { AdminModel } from '../admin/admin.model';
import { CustomerModel } from '../customer/models/customer.model';
import { CustomerService } from '../customer/services/customer.service';
import { EmailHelper } from '../utility/services/email/email.helper';
import { DOCUMENT_REPOSITORY } from './constants';
import { DocumentModel as Document } from './document.model';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private readonly docRepo: typeof Document,
    private readonly customerService: CustomerService,
    private readonly emailHelper: EmailHelper,
  ) {}

  async create(newDocument: CreateDocumentDto): Promise<Document> {
    const customer = await this.customerService.findById(newDocument.customer_id);
    
    const document = await this.docRepo.create(newDocument);
    this.emailHelper.sendDocument(document, customer.firstname, customer.email);

    return document;
  }

  async sendDocument(id: number) {
    const document = await this.findById(id);
    this.emailHelper.sendDocument(document);

    return "Document sent";
  }

  async findAll(params): Promise<FindAllQueryInterface<Document>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: DefaultQueryAttributeExclude
      },
      where: {
        ...params.where
      },
      include: [
        {
          model: CustomerModel,
          attributes: { exclude: DefaultQueryAttributeExclude },
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
    };

    const documents = await this.docRepo.findAndCountAll(query);
    const paging = pagingParser(query, documents.count, documents.rows.length);

    return {
      paging,
      rows: documents.rows
    };
  }

  async findById(id: number, throwNotFoundError = true): Promise<Document> {
    const document = await this.docRepo.findByPk(id,
      {
        attributes: { exclude: DefaultQueryAttributeExclude },
        include: [
          {
            model: CustomerModel,
            attributes: { exclude: DefaultQueryAttributeExclude },
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

    if (!document && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.DocumentNotFound);

    return document;
  }

  async findOne(params, throwNotFoundError = true): Promise<Document> {
    const document = await this.docRepo.findOne(
      {
        where: {
          ...params
        },
        attributes: { exclude: DefaultQueryAttributeExclude },
        include: [
          {
            model: CustomerModel,
            attributes: { exclude: DefaultQueryAttributeExclude },
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

    if (!document && throwNotFoundError)
      throw new BadRequestException(ERROR_MESSAGES.DocumentNotFound);

    return document;
  }

  async update(id: number, newUpdate: UpdateDocumentDto): Promise<Document> {
    const document = await this.findById(id);
   
    if (newUpdate.send_to_user) {
      const updatedDoc = await document.update(newUpdate)
      this.emailHelper.sendDocument(updatedDoc)

      return updatedDoc;
    }
    
    return document.update(newUpdate);
  }
}
