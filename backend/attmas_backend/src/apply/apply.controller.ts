import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { ApplyService } from './apply.service';
import { CreateApplyDto } from './apply.dto';
import { Apply } from './apply.schema';

@Controller('Apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Post()
  async create(@Body() createApplyDto: CreateApplyDto): Promise<Apply> {
    return this.applyService.create(createApplyDto);
  }

  @Get()
  async findAll(): Promise<Apply[]> {
    return this.applyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Apply> {
    const apply = await this.applyService.findJobWithUser(id);
    if (!apply) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return apply;
  }
}
