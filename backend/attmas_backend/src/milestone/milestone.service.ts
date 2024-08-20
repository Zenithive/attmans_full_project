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
    console.log('Received DTO:', createMilestoneDto);
    const {
      scopeOfWork,
      milestones,
      userId,
      applyId,
      jobId,
      milstonSubmitcomments,
    } = createMilestoneDto;

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
      milstonSubmitcomments: milstonSubmitcomments || [],
    });

    return milestone.save();
  }

  async getMilestonesByApplyId(applyId: string): Promise<Milestone[]> {
    return this.milestoneModel.find({ applyId }).exec();
  }

  async submitComment(
    applyId: string,
    milestoneIndex: number,
    comment: string,
  ): Promise<void> {
    const milestone = await this.milestoneModel.findOne({ applyId });
    if (!milestone) {
      throw new NotFoundException(`Milestone not found for applyId ${applyId}`);
    }

    // Ensure the milestone exists before updating
    if (milestone.milestones[milestoneIndex]) {
      // Update the specific milestone's status and comment
      milestone.milestones[milestoneIndex].isCommentSubmitted = true;
      milestone.milestones[milestoneIndex].status = 'Submitted';
    }

    // Update comments array if needed
    milestone.milstonSubmitcomments[milestoneIndex] = comment;

    await milestone.save();
  }

  async getSubmittedComments(applyId: string): Promise<string[]> {
    const milestone = await this.milestoneModel.findOne({ applyId });
    if (!milestone) {
      throw new NotFoundException(`Milestone not found for applyId ${applyId}`);
    }

    return milestone.milstonSubmitcomments;
  }
}
