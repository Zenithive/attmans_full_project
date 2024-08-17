import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Milestone, MilestoneDocument } from './milestone.schema';
import { User, UserDocument } from '../users/user.schema';
import { Jobs, JobsDocument } from 'src/projects/projects.schema';
import { Apply, ApplyDocument } from '../apply/apply.schema';
import { CreateMilestoneDto } from './create-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectModel(Milestone.name)
    private readonly milestoneModel: Model<MilestoneDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Jobs.name) private readonly jobsModel: Model<JobsDocument>,
    @InjectModel(Apply.name)
    private readonly appliesModel: Model<ApplyDocument>,
  ) {}

  async create(createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    const { scopeOfWork, milestones, userId, applyId, jobId, status } =
      createMilestoneDto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const job = await this.jobsModel.findById(jobId);
    if (!job) {
      throw new NotFoundException(`Job with id ${jobId} not found`);
    }

    const apply = await this.appliesModel.findById(applyId);
    if (!apply) {
      throw new NotFoundException(`Application with id ${applyId} not found`);
    }

    const milestone = new this.milestoneModel({
      scopeOfWork,
      milestones,
      userId,
      jobId,
      applyId,
      status: status || 'Pending',
    });

    return milestone.save();
  }

  async getMilestonesByApplyId(applyId: string): Promise<Milestone[]> {
    return this.milestoneModel.find({ applyId }).exec();
  }
}
