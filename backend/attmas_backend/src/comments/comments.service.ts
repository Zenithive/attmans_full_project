import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Comment, CommentDocument } from './comments.schema';
import { AddCommentDto } from './create-comments.dto';
import { User, UserDocument } from 'src/users/user.schema';
import { Jobs, JobsDocument } from 'src/projects/projects.schema';
import { Apply, ApplyDocument } from 'src/apply/apply.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
    @InjectModel(Apply.name) private appliesModel: Model<ApplyDocument>,
  ) {}

  async create(addCommentDto: AddCommentDto): Promise<Comment> {
    const { createdBy, jobId, applyId, commentText } = addCommentDto;
    console.log('{ createdBy, jobId, applyId, commentText }', {
      createdBy,
      jobId,
      applyId,
      commentText,
    });

    const user = await this.userModel.findById(createdBy);
    if (!user) {
      throw new NotFoundException(`User with id ${createdBy} not found`);
    }

    console.log('user', user);

    const job = await this.jobsModel.findById(jobId);
    if (!job) {
      throw new NotFoundException(`Job with id ${jobId} not found`);
    }

    console.log('job', job);

    const apply = await this.appliesModel.findById(applyId);
    if (!apply) {
      throw new NotFoundException(`Apply with id ${applyId} not found`);
    }

    console.log('apply', apply);

    const comment = new this.commentModel({
      commentText,
      createdBy,
      createdAt: new Date(),
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      jobId,
      applyId,
    });

    console.log('comment', comment);
    return comment.save();
  }

  async findByJobAndApply(jobId: string, applyId: string): Promise<Comment[]> {
    return this.commentModel.find({ jobId, applyId }).exec();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }
}
