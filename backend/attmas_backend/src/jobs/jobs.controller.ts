import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobsDto, UpdateJobsDto } from './create-jobs.dto';
import { Jobs } from './jobs.schema';

@Controller('jobs')
export class jobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() createJobsDto: CreateJobsDto): Promise<Jobs> {
    return this.jobsService.create(createJobsDto);
  }

  @Get()
  async findAll(): Promise<Jobs[]> {
    return this.jobsService.findAll();
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
}
