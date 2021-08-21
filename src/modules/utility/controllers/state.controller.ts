import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { StateService } from '../services/state.service';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';

@ApiTags('State')
@Controller('state')
@UseInterceptors(TransformInterceptor)
export class StateController {
  constructor(private readonly stateService: StateService) { }

  @Get()
  async findAll(@Query() query: BaseQueryFiltersDto) {

    query = parseQueryObj(query, []);
    return this.stateService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.stateService.findById(id);
  }
}
