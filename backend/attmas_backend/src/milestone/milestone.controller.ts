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
    console.log('Fetching milestones for applyId:', applyId);
    return this.milestonesService.getMilestonesByApplyId(applyId);
  }

  @Post('/submit-comment')
  async submitComment(
    @Body('applyId') applyId: string,
    @Body('milestoneIndex') milestoneIndex: number,
    @Body('comment') comment: string,
  ): Promise<void> {
    return this.milestonesService.submitComment(
      applyId,
      milestoneIndex,
      comment,
    );
  }

  @Get('/comments/:applyId')
  async getSubmittedComments(
    @Param('applyId') applyId: string,
  ): Promise<string[]> {
    return this.milestonesService.getSubmittedComments(applyId);
  }

  @Get('submitted/:applyId')
  async findSubmittedMilestones(
    @Param('applyId') applyId: string,
  ): Promise<Milestone[]> {
    const submittedMilestones =
      await this.milestonesService.findSubmittedMilestones(applyId);
    console.log('submittedMilestones', submittedMilestones);
    return submittedMilestones;
  }

  @Post('/approve')
  async approveMilestone(
    @Body('applyId') applyId: string,
    @Body('milestoneIndex') milestoneIndex: number,
    @Body('comment') comment: string,
  ): Promise<void> {
    return this.milestonesService.approveMilestone(
      applyId,
      milestoneIndex,
      comment,
    );
  }

  @Post('/reject')
  async rejectMilestone(
    @Body('applyId') applyId: string,
    @Body('milestoneIndex') milestoneIndex: number,
    @Body('comment') comment: string,
  ): Promise<void> {
    return this.milestonesService.rejectMilestone(
      applyId,
      milestoneIndex,
      comment,
    );
  }
}
