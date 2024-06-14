import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/users/user.schema';
import { Jobs, JobsDocument } from './projects.schema';
import { CreateJobsDto, UpdateJobsDto } from './create-projects.dto';

@Injectable()
export class JobsService {
  [x: string]: any;
  constructor(
    @InjectModel(Jobs.name)
    private jobsModel: Model<JobsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createJobsDto: CreateJobsDto): Promise<Jobs> {
    const createdJobs = new this.jobsModel(createJobsDto);
    return createdJobs.save();
  }

  async findAll(): Promise<Jobs[]> {
    return this.jobsModel
      .find()
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
  }

  async findJobWithUser(id: string): Promise<Jobs> {
    return this.jobsModel.findById(id).populate('user').exec();
  }

  async update(id: string, updateJobsDto: UpdateJobsDto): Promise<Jobs> {
    const existingJob = await this.jobsModel.findById({ _id: id });
    console.log('update existingJobs', existingJob);
    if (!existingJob) {
      throw new NotFoundException(`Jobs with id ${id} not found`);
    }
    Object.assign(existingJob, updateJobsDto);
    return existingJob.save();
  }

  async delete(id: string): Promise<Jobs> {
    const existingJobDelete = await this.jobsModel.findByIdAndDelete({
      _id: id,
    });
    console.log('deleye existingJobs', existingJobDelete);
    if (!existingJobDelete) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return existingJobDelete;
  }
}
