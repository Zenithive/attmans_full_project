import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersonalProfile } from './schemas/personalProfile.schema';
import { WorkExprience } from './schemas/work.exprience.shema';
import { Categories } from './schemas/category.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(PersonalProfile.name)
    private readonly profileModel: Model<PersonalProfile>,
    @InjectModel(WorkExprience.name)
    private readonly workExprience: Model<WorkExprience>,
    @InjectModel(Categories.name)
    private readonly categories: Model<Categories>,
    private readonly usersService: UsersService,
  ) {}

  async createForm1(
    PersonalProfile: PersonalProfile,
  ): Promise<PersonalProfile> {
    const createdProfile = new this.profileModel(PersonalProfile);
    return createdProfile.save();
  }

  async createForm2(WorkExprience: WorkExprience): Promise<WorkExprience> {
    console.log('workExprience', WorkExprience);
    const createdProfile = new this.workExprience(WorkExprience);
    const Profiled = createdProfile.save();
    await this.usersService.updateUserTypes(
      WorkExprience.username,
      WorkExprience.userType,
    );
    return Profiled;
  }

  async createForm3(Categories: Categories): Promise<Categories> {
    const createdProfile = new this.categories(Categories);
    await this.usersService.updateProfileCompletionStatus(Categories.username);
    return createdProfile.save();
  }

  async updateUserType(username: string, userType: string): Promise<void> {
    await this.usersService.updateUserTypes(username, userType);
  }

  private async checkAndUpdateProfileCompletion(
    username: string,
  ): Promise<void> {
    await this.usersService.updateProfileCompletionStatus(username);
  }
}
