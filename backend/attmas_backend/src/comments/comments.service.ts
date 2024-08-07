import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Comment, CommentDocument } from './comments.schema';
import { AddCommentDto } from './create-comments.dto';
import { User, UserDocument } from 'src/users/user.schema';
import { Jobs, JobsDocument } from 'src/projects/projects.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
  ) {}

  async create(addCommentDto: AddCommentDto): Promise<Comment> {
    const { createdBy, jobId, commentText } = addCommentDto;
    console.log('{ createdBy, jobId, commentText }', {
      createdBy,
      jobId,
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

    const comment = new this.commentModel({
      commentText,
      createdBy,
      createdAt: new Date(),
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      jobId,
    });

    console.log('comment', comment);
    return comment.save();
  }

  async findByJobId(jobId: string): Promise<Comment[]> {
    return this.commentModel.find({ jobId }).exec();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }
}
