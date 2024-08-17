import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MilestonesService } from './milestone.service';
import { CreateMilestoneDto } from './create-milestone.dto';
import { Milestone } from './milestone.schema';

@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  async create(
    @Body() createMilestoneDto: CreateMilestoneDto,
  ): Promise<Milestone> {
    return this.milestonesService.create(createMilestoneDto);
  }

  @Get('/apply/:applyId')
  async getMilestonesByApplyId(
    @Param('applyId') applyId: string,
  ): Promise<Milestone[]> {
    return this.milestonesService.getMilestonesByApplyId(applyId);
  }
}
