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
import { UpdateStatusesDto } from './update-statuses.dto'; // Import the DTO

@Controller('Apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) { }

  @Post()
  async create(@Body() createApplyDto: CreateApplyDto): Promise<Apply> {
    return this.applyService.create(createApplyDto);
  }

  @Post('reward/:id')
  async rewardApplication(@Param('id') id: string): Promise<Apply> {
    return this.applyService.rewardApplication(id);
  }

  @Post('updateStatuses')
  async updateStatuses(@Body() updateStatusesDto: UpdateStatusesDto): Promise<void> {
    return this.applyService.updateStatuses(updateStatusesDto);
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

  @Post('approve/:id')
  async approve(@Param('id') id: string) {
    return this.applyService.approveApplication(id);
  }

  @Post('reject/:id')
  async reject(
    @Param('id') id: string,
    @Body('rejectComment') rejectComment: string,
  ) {
    return this.applyService.rejectApplication(id, rejectComment);
  }

  @Get('jobId/:jobId')
  async findByJobId(@Param('jobId') jobId: string) {
    return this.applyService.findByJobId(jobId);
  }

  @Get('user/:userId')
  async getApplicationsByUser(@Param('userId') userId: string) {
    return this.applyService.findApplicationsByUserId(userId);
  }

  @Get('appliedJobs/:userId')
  async getAppliedJobs(@Param('userId') userId: string) {
    return this.applyService.findAppliedJobs(userId);
  }

  @Get('jobDetails/:jobId')
  async getJobDetails(@Param('jobId') jobId: string) {
    return this.applyService.findJobDetails(jobId);
  }
}
