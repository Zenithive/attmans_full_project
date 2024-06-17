import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Apply, ApplyDocument } from './apply.schema';
import { CreateApplyDto } from './apply.dto';
import { User, UserDocument } from 'src/users/user.schema';

@Injectable()
export class ApplyService {
  [x: string]: any;
  constructor(
    @InjectModel(Apply.name)
    private ApplyModel: Model<ApplyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createApplyDto: CreateApplyDto): Promise<Apply> {
    const createdApply = new this.ApplyModel(createApplyDto);
    return createdApply.save();
  }

  async findAll(): Promise<Apply[]> {
    return this.jobsModel
      .find()
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
  }

  async findJobWithUser(id: string): Promise<Apply> {
    return this.jobsModel.findById(id).populate('user').exec();
  }
}
