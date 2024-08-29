import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Apply, ApplyDocument } from 'src/apply/apply.schema';
import { Jobs, JobsDocument } from 'src/projects/projects.schema';
import { User, UserDocument } from 'src/users/user.schema';
import { CreateMilestoneDto } from './create-milestone.dto';
import { Milestone, MilestoneDocument } from './milestone.schema';

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
    const {
      scopeOfWork,
      milestones,
      userId,
      applyId,
      jobId,
      milstonSubmitcomments,
    } = createMilestoneDto;

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const job = await this.jobsModel.findById(jobId);
    if (!job) throw new NotFoundException(`Job with id ${jobId} not found`);

    const apply = await this.appliesModel.findById(applyId);
    if (!apply)
      throw new NotFoundException(`Application with id ${applyId} not found`);

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
      milestone.milestones[milestoneIndex].isCommentSubmitted = true;
      milestone.milestones[milestoneIndex].status = 'Submitted';
      milestone.milestones[milestoneIndex].submittedAt = new Date(); // Set the submission date
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

  async getMilestonesByApplyId(applyId: string): Promise<Milestone[]> {
    const milestones = await this.milestoneModel.find({ applyId }).exec();
    if (!milestones || milestones.length === 0) {
      throw new NotFoundException(`No milestones found for applyId ${applyId}`);
    }
    return milestones;
  }

  async findSubmittedMilestones(applyId: string): Promise<any[]> {
    const submittedMilestones = await this.milestoneModel
      .aggregate([
        { $match: { applyId } },
        { $unwind: '$milestones' },
        { $match: { 'milestones.adminStatus': 'Approved' } },
        {
          $project: {
            _id: 0,
            'milestones._id': 1,
            'milestones.name': 1,
            'milestones.status': 1,
            'milestones.submittedAt': 1,
            'milestones.adminStatus': 1,
            'milestones.adminComments': 1,
          },
        },
      ])
      .exec();

    console.log('Raw Aggregation Result:', submittedMilestones);

    const allSubmittedMilestones = submittedMilestones.map(
      (doc) => doc.milestones,
    );

    console.log(
      `Submitted Milestones for applyId ${applyId}:`,
      allSubmittedMilestones,
    );

    return allSubmittedMilestones;
  }

  async approveMilestone(
    applyId: string,
    milestoneIndex: number,
    comment: string,
  ): Promise<void> {
    const milestone = await this.milestoneModel.findOne({ applyId });
    if (!milestone) {
      throw new NotFoundException(`Milestone not found for applyId ${applyId}`);
    }

    if (milestone.milestones[milestoneIndex]) {
      milestone.milestones[milestoneIndex].adminStatus = 'Approved';
      milestone.milestones[milestoneIndex].adminComments.push(comment);
    } else {
      throw new BadRequestException(
        `Milestone index ${milestoneIndex} is out of bounds`,
      );
    }

    await milestone.save();
  }

  async rejectMilestone(
    applyId: string,
    milestoneIndex: number,
    comment: string,
  ): Promise<void> {
    const milestone = await this.milestoneModel.findOne({ applyId });
    if (!milestone) {
      throw new NotFoundException(`Milestone not found for applyId ${applyId}`);
    }

    if (milestone.milestones[milestoneIndex]) {
      milestone.milestones[milestoneIndex].adminStatus = 'Rejected';
      milestone.milestones[milestoneIndex].adminComments.push(comment);
    } else {
      throw new BadRequestException(
        `Milestone index ${milestoneIndex} is out of bounds`,
      );
    }

    await milestone.save();
  }
}
