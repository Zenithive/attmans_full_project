import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { JobsService } from './projects.service';
import { CreateJobsDto, UpdateJobsDto } from './create-projects.dto';
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
    @Query('limit') limit: number = 10,
    @Query('Category') Category: string[] = [],
    @Query('userId') userId?: string,
    @Query('Subcategorys') Subcategorys: string[] = [],
    @Query('Expertiselevel') Expertiselevel: string[] = [],
    @Query('status') status?: string,
  ): Promise<Jobs[]> {
    return this.jobsService.findAll(
      page,
      limit,
      Category,
      userId,
      Subcategorys,
      Expertiselevel,
      status,
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
}
