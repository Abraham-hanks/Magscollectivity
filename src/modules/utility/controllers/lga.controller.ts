import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { LgaService } from '../services/lga.service';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { LgaQueryFiltersDto } from '../dto/lga-query-filters.dto';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';


@ApiTags('Lga')
@Controller('lga')
@UseInterceptors(TransformInterceptor)
export class LgaController {
  constructor(private readonly lgaService: LgaService) { }

  @Get()
  async findAll(@Query() query: LgaQueryFiltersDto) {
    query = parseQueryObj(query, ['state_id']);

    return this.lgaService.findAll(query);
  }

  // @Get('name:/lga_name')
  // async findByName(
  //   @Param('id', ParseIntPipe) lga_name: string,
  // ) {
  //   return this.lgaService.findByName(lga_name);
  // }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.lgaService.findById(id);
  }

}
