import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CHANGE_REQUEST_REPOSITORY, REQUEST_STATUS } from './constants';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { ChangeRequestModel as ChangeRequest } from './change-request.model'
import { ProductService } from '../product/services/product.service';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { CustomerModel } from '../customer/models/customer.model';
import { ProductModel } from '../product/models/product.model';
import { pagingParser } from 'src/common/utils/paging-parser';
import { FindOptions } from 'sequelize';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { ChargeModel } from '../charge/models/charge.model';
import { UpdateChangeRequestStatus } from './dto/update-change-request.dto';
import { EmailHelper } from '../utility/services/email/email.helper';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { ChargeService } from '../charge/services/charge.service';

@Injectable()
export class ChangeRequestService {
  constructor(
    @Inject(CHANGE_REQUEST_REPOSITORY) private readonly changeRequestRepo: typeof ChangeRequest,
    private readonly chargeService: ChargeService,
    private readonly emailHelper: EmailHelper,
    private readonly productService: ProductService,
  ) { }

  async create(newRequest: CreateChangeRequestDto): Promise<ChangeRequest> {
    if (await this.productService.findById(newRequest.product_id)) {
      const changeRequest = await this.changeRequestRepo.create(newRequest);
      return changeRequest;
    }
    // else what happens?
  }

  async findById(id: number): Promise<ChangeRequest> {
    const changeRequest = await this.changeRequestRepo.findByPk(id, {
      attributes: {
        exclude: DefaultQueryAttributeExclude,
      },
      include: [
        {
          model: CustomerModel,
          attributes: { exclude: DefaultQueryAttributeExclude },
        },
        {
          model: ProductModel,
          attributes: { exclude: DefaultQueryAttributeExclude },
        },
        {
          model: ChargeModel,
          attributes: { exclude: DefaultQueryAttributeExclude },
        }
      ],
    });

    if (!changeRequest)
      throw new BadRequestException(ERROR_MESSAGES.ChangeRequestNotFound);
    
    return changeRequest;
  }

  async findAll(params): Promise<FindAllQueryInterface<ChangeRequest>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: DefaultQueryAttributeExclude
      },
      where: {
        ...params.where
      }
    };

    const requests = await this.changeRequestRepo.findAndCountAll(query);
    const paging = pagingParser(query, requests.count, requests.rows.length);

    return {
      paging,
      rows: requests.rows
    };
  }

  // async setRequestApproval(id: number, updateChangeReqStatus: UpdateChangeRequestStatus, approval: boolean): Promise<ChangeRequest> {
  //   const request = await this.findById(id);

  //   if (approval && request.approved)
  //     throw new BadRequestException(ERROR_MESSAGES.ChangeRequestAlreadyApproved);
    

  //   if (!approval && !request.approved)
  //     throw new BadRequestException(ERROR_MESSAGES.ChangeRequestAlreadyDisapproved);
    

  //   if (updateChangeReqStatus.charge_id)
  //     await this.chargeService.findById(updateChangeReqStatus.charge_id)
    

  //   request.approved = approval;
  //   request.status = approval ? REQUEST_STATUS.APPROVED : REQUEST_STATUS.DISAPPROVED;
  //   request.updated_by_id = updateChangeReqStatus.admin_id;
  //   request.approval_date = request.approved ? new Date() : null;
  //   request.disapproval_reason = request.approved ? null : updateChangeReqStatus.disapproval_reason ? updateChangeReqStatus.disapproval_reason : null;
  //   request.charge_id = updateChangeReqStatus.charge_id;

  //   // send email notification to customer
  //   this.emailHelper.changeRequest(request);

  //   return request.save();
  // }
}
