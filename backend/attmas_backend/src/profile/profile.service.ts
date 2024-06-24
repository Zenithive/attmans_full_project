import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersonalProfile } from './schemas/personalProfile.schema';
import { WorkExprience } from './schemas/work.exprience.schema';
import { Categories } from './schemas/category.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
  [x: string]: any;
  constructor(
    @InjectModel(PersonalProfile.name)
    private readonly profileModel: Model<PersonalProfile>,
    @InjectModel(WorkExprience.name)
    private readonly workExprience: Model<WorkExprience>,
    @InjectModel(Categories.name)
    private readonly categories: Model<Categories>,
    private readonly usersService: UsersService,
  ) {}

  // async createForm1(
  //   PersonalProfile: PersonalProfile,
  // ): Promise<PersonalProfile> {
  //   const createdProfile = new this.profileModel(PersonalProfile);
  //   return createdProfile.save();
  // }

  async createOrUpdateForm1(
    personalProfile: PersonalProfile,
  ): Promise<PersonalProfile> {
    const existingProfile = await this.profileModel.findOne({
      username: personalProfile.username,
    });
    if (existingProfile) {
      // Update the existing profile
      Object.assign(existingProfile, personalProfile);
      return existingProfile.save();
    } else {
      // Create a new profile
      const createdProfile = new this.profileModel(personalProfile);
      return createdProfile.save();
    }
  }

  // async createForm2(WorkExprience: WorkExprience): Promise<WorkExprience> {
  //   console.log('workExprience', WorkExprience);
  //   const createdProfile = new this.workExprience(WorkExprience);
  //   const Profiled = createdProfile.save();
  //   await this.usersService.updateUserTypes(
  //     WorkExprience.username,
  //     WorkExprience.userType,
  //   );
  //   return Profiled;
  // }

  async createOrUpdateForm2(
    workExprience: WorkExprience,
  ): Promise<WorkExprience> {
    console.log('workExprience', workExprience);
    const existingProfile = await this.workExprience.findOne({
      username: workExprience.username,
    });
    if (existingProfile) {
      // Update the existing profile
      Object.assign(existingProfile, workExprience);
      const updatedProfile = await existingProfile.save();
      await this.usersService.updateUserTypes(
        workExprience.username,
        workExprience.userType,
      );
      return updatedProfile;
    } else {
      // Create a new profile
      const createdProfile = new this.workExprience(workExprience);
      const Profiled = await createdProfile.save();
      await this.usersService.updateUserTypes(
        workExprience.username,
        workExprience.userType,
      );
      return Profiled;
    }
  }

  // async createForm3(Categories: Categories): Promise<Categories> {
  //   const createdProfile = new this.categories(Categories);
  //   await this.usersService.updateProfileCompletionStatus(Categories.username);
  //   return createdProfile.save();
  // }

  // async updateUserType(username: string, userType: string): Promise<void> {
  //   await this.usersService.updateUserTypes(username, userType);
  // }

  //   private async checkAndUpdateProfileCompletion(
  //     username: string,
  //   ): Promise<void> {
  //     await this.usersService.updateProfileCompletionStatus(username);
  //   }
  // }

  async createOrUpdateForm3(categories: Categories): Promise<Categories> {
    const existingProfile = await this.categories.findOne({
      username: categories.username,
    });
    if (existingProfile) {
      // Update the existing profile
      Object.assign(existingProfile, categories);
      const updatedProfile = await existingProfile.save();
      await this.usersService.updateProfileCompletionStatus(
        categories.username,
      );
      return updatedProfile;
    } else {
      // Create a new profile
      const createdProfile = new this.categories(categories);
      await this.usersService.updateProfileCompletionStatus(
        categories.username,
      );
      return createdProfile.save();
    }
  }

  async updateUserType(username: string, userType: string): Promise<void> {
    await this.usersService.updateUserTypes(username, userType);
  }

  private async checkAndUpdateProfileCompletion(
    username: string,
  ): Promise<void> {
    await this.usersService.updateProfileCompletionStatus(username);
  }

  async getProfileCompletionStatus(
    username: string,
  ): Promise<{ profileCompleted: number }> {
    const form1 = await this.profileModel.findOne({ username });
    if (!form1) return { profileCompleted: 1 };

    const form2 = await this.workExprience.findOne({ username });
    if (!form2) return { profileCompleted: 2 };

    const form3 = await this.categories.findOne({ username });
    if (!form3) return { profileCompleted: 3 };

    return { profileCompleted: 4 }; // Assume 4 means all steps completed
  }

  async getProfileByUserId(username: string): Promise<PersonalProfile> {
    return this.profileModel.findOne({ username }).exec();
  }
}
