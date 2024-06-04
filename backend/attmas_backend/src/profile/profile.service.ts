import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile1 } from './schemas/profile.schema';
import { WorkExprience } from './schemas/work.exprience.shema';
import { Categories } from './schemas/category.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile1.name) private readonly profileModel: Model<Profile1>,
    @InjectModel(WorkExprience.name)
    private readonly workExprience: Model<WorkExprience>,
    @InjectModel(Categories.name)
    private readonly categories: Model<Categories>,
  ) {}

  async createForm1(Profile1: Profile1): Promise<Profile1> {
    const createdProfile = new this.profileModel(Profile1);
    return createdProfile.save();
  }

  async createForm2(WorkExprience: WorkExprience): Promise<WorkExprience> {
    const createdProfile = new this.workExprience(WorkExprience);
    return createdProfile.save();
  }

  async createForm3(Categories: Categories): Promise<Categories> {
    const createdProfile = new this.categories(Categories);
    return createdProfile.save();
  }
}
