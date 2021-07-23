import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { DefaultQueryAttributeExclude } from "src/common/constants";
import { FindAllQueryInterface } from "src/common/interface/find-query.interface";
import { ERROR_MESSAGES } from "src/common/utils/error-messages";
import { pagingParser } from "src/common/utils/paging-parser";
import { AuthModel } from "src/modules/auth/auth.model";
import { Readable } from "stream";
import { AUDIT_REPOSITORY } from "../constants";
import { CreateAuditDto } from "../dto/audit.dto";
import { AuditModel as Audit } from '../models/audit.model'

@Injectable()
export class AuditService {
  constructor(
    @Inject(AUDIT_REPOSITORY) private readonly auditRepo: typeof Audit,
  ) { }

  async create(newAudit: CreateAuditDto): Promise<Audit> {
    return this.auditRepo.create(newAudit);
  }

  async findById(id: number): Promise<Audit> {
    const audit = await this.auditRepo.findByPk(id,
      {
        attributes: { exclude: DefaultQueryAttributeExclude },
        include: [
          {
            model: AuthModel,
            attributes: {
              exclude: DefaultQueryAttributeExclude
            },
          },
        ],
      }
    );

    if (!audit)
      throw new BadRequestException(ERROR_MESSAGES.AuditNotFound);

    return audit;
  }

  async findAll(params): Promise<FindAllQueryInterface<Audit>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: DefaultQueryAttributeExclude
      },
      include: [
        {
          model: AuthModel,
          attributes: {
            exclude: DefaultQueryAttributeExclude
          },
        },
      ],
      where: {
        ...params.where
      }
    };

    const audits = await this.auditRepo.findAndCountAll(query);
    const paging = pagingParser(query, audits.count, audits.rows.length);

    return {
      paging,
      rows: audits.rows,
    };
  }

  async getCount(params): Promise<number> {
    return this.auditRepo.count({
      where: params.where
    });
  }

  getStream(params) {
    let maxPage;
    const query: any = {
      page: 0,
      limit: 100,
      //order: params.order,
      attributes: {
        include: params.include || null,
        exclude: DefaultQueryAttributeExclude
      },
      where: {
        ...params.where
      }
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
        return this.auditRepo.findAll(query)
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
}