import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersonalProfile } from './schemas/personalProfile';
import { WorkExprience } from './schemas/work.exprience.shema';
import { Categories } from './schemas/category.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(PersonalProfile.name)
    private readonly profileModel: Model<PersonalProfile>,
    @InjectModel(WorkExprience.name)
    private readonly workExprience: Model<WorkExprience>,
    @InjectModel(Categories.name)
    private readonly categories: Model<Categories>,
  ) {}

  async createForm1(
    PersonalProfile: PersonalProfile,
  ): Promise<PersonalProfile> {
    const createdProfile = new this.profileModel(PersonalProfile);
    return createdProfile.save();
  }

  async createForm2(WorkExprience: WorkExprience): Promise<WorkExprience> {
    const createdProfile = new this.workExprience(WorkExprience);
    const Profiled = createdProfile.save();
    return Profiled;
  }

  async createForm3(Categories: Categories): Promise<Categories> {
    const createdProfile = new this.categories(Categories);
    return createdProfile.save();
  }
}
