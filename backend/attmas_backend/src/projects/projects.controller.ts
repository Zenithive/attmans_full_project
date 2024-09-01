import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { JobsService } from './projects.service';
import {
  AddCommentDto,
  CreateJobsDto,
  UpdateJobsDto,
} from './create-projects.dto';
import { Jobs } from './projects.schema';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() createJobsDto: CreateJobsDto): Promise<Jobs> {
    return this.jobsService.create(createJobsDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: string = '10',
    @Query('Category') Category: string[] = [],
    @Query('userId') userId?: string,
    @Query('Subcategorys') Subcategorys: string[] = [],
    @Query('Expertiselevel') Expertiselevel: string[] = [],
    @Query('status') status?: string,
    @Query('title') title?: string,
    @Query('createdAt') createdAt?: string,
    @Query('SelectService') SelectService: string[] = [],
    @Query('TimeFrame') TimeFrame?: string,
    @Query('ProjectOwner') ProjectOwner?: string,
  ): Promise<Jobs[]> {
    return this.jobsService.filterJobs(
      page,
      parseInt(limit),
      Category,
      userId,
      Subcategorys,
      Expertiselevel,
      status,
      SelectService,
      title,
      createdAt,
      TimeFrame,
      ProjectOwner,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Jobs> {
    const job = await this.jobsService.findJobWithUser(id);
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return job;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobsDto: UpdateJobsDto,
  ): Promise<Jobs> {
    const updatedJob = await this.jobsService.update(id, updateJobsDto);
    console.log('updatedJob', updatedJob);
    if (!updatedJob) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return updatedJob;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Jobs> {
    const deletedJob = await this.jobsService.delete(id);
    if (!deletedJob) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return deletedJob;
  }

  @Post('approve/:id')
  async approveProject(@Param('id') id: string): Promise<Jobs> {
    return this.jobsService.approveProject(id);
  }

  @Post('reject/:id')
  async rejectProject(
    @Param('id') id: string,
    @Body() body: { comment: string },
  ): Promise<Jobs> {
    console.log('Received body:', body);
    return this.jobsService.rejectProject(id, body.comment);
  }

  @Post('comments/:id')
  async addComment(
    @Param('id') jobId: string,
    @Body() addCommentDto: AddCommentDto,
  ) {
    return this.jobsService.addComment(jobId, addCommentDto);
  }

  @Post('update-status-closecomment/:id')
  async updateStatusAndComment(
    @Param('id') id: string,
    @Body() updateData: { status: string; comment: string },
  ): Promise<Jobs> {
    const { comment } = updateData;

    // Set status to "Closed"
    const status = 'Project Finished and close';

    // Log the ID, status, and comment
    console.log(`Updating job with ID: ${id}`);
    console.log(`Status: ${status}`);
    console.log(`Comment: ${comment}`);

    // Pass the ID, status, and comment to the service method
    return this.jobsService.updateStatusAndComment(id, status, comment);
  }

  @Post('update-status-closecommentByAdmin/:id')
  async updateStatusAndCommentByAdmin(
    @Param('id') id: string,
    @Body() updateData: { status: string; comment: string },
  ): Promise<Jobs> {
    const { comment, status } = updateData;

    console.log(`Admin closing project with ID: ${id}`);
    console.log(`Status: ${status}`);
    console.log(`Comment: ${comment}`);

    return this.jobsService.updateStatusAndCommentByAdmin(id, status, comment);
  }
}
