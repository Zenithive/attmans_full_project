import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { ApplyService } from './apply.service';
import { CreateApplyDto } from './apply.dto';
import { Apply } from './apply.schema';
import { UpdateStatusesDto } from './update-statuses.dto'; // Import the DTO
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth1/guards/jwt-auths.guard';

@Controller('Apply')
@UseGuards(JwtAuthGuard)
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Post()
  async create(@Body() createApplyDto: CreateApplyDto): Promise<Apply> {
    return this.applyService.create(createApplyDto);
  }

  @Post('reward/:id')
  async rewardApplication(
    @Param('id') id: string,
    @Body() body: { jobId: string; Comment?: string }, // Handle both jobId and optional comment
  ): Promise<Apply> {
    const { jobId, Comment } = body;
    console.log(`Rewarding application with ID: ${id} for Job ID: ${jobId}`);
    if (Comment) {
      console.log(`Comment: ${Comment}`);
    }
    return this.applyService.rewardApplication(id, jobId, Comment); // Pass the comment to the service
  }

  @Post('updateStatuses')
  async updateStatuses(
    @Body() updateStatusesDto: UpdateStatusesDto,
  ): Promise<void> {
    return this.applyService.updateStatuses(updateStatusesDto);
  }

  @Get()
  async findAll(): Promise<Apply[]> {
    return this.applyService.findAll();
  }

  @Get('applyformyProject')
  async findAllMyProject(@Query('userId') userId: string): Promise<Apply[]> {
    console.log('UserId received in controller:', userId); // Log the received userId
    return this.applyService.findAllMyProject(userId);
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
    try {
      const objectId = new Types.ObjectId(jobId);
      const applications = await this.applyService.findByJobId(objectId);
      return applications;
    } catch (error) {
      console.error('Error in findByJobId:', error);
      throw new HttpException(
        'Error fetching applications',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId')
  async getApplicationsByUser(@Param('userId') userId: string) {
    return this.applyService.findApplicationsByUserId(userId);
  }

  @Get('appliedJobs/:userId')
  async getAppliedJobs(
    @Param('userId') userId: string,
    @Query('projTitle') projTitle: string,
    @Query('Category') Category: string,
    @Query('Subcategorys') Subcategorys: string,
  ) {
    return this.applyService.findAppliedJobs(
      userId,
      projTitle,
      Category,
      Subcategorys,
    );
  }

  @Get('appliedJobsForAdmin/status/:status')
  async getAppliedJobsForAdmin(@Param('status') status: string) {
    return this.applyService.findAppliedJobsForAdmin(status);
  }

  @Get('jobDetails/:jobId')
  async getJobDetails(@Param('jobId') jobId: string) {
    return this.applyService.findJobDetails(jobId);
  }
}
