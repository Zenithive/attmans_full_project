import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersonalProfile } from './schemas/personalProfile.schema';
import { ProductInfo, WorkExprience } from './schemas/work.exprience.schema';
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
  ) { }

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

    return { profileCompleted: 4 };
  }

  async getAllCategories(): Promise<Categories[]> {
    return this.categories.find().exec();
  }

  async getProfileByUsername(
    username: string,
  ): Promise<PersonalProfile | null> {
    return this.profileModel.findOne({ username }).exec();
  }

  async getProfileByUsername2(username: string): Promise<WorkExprience | null> {
    return this.workExprience.findOne({ username }).exec();
  }

  // async getProductNameByUsername(username: string): Promise<WorkExprience | null> {
  //   const product = this.workExprience.findOne({ username }).exec();
  //   console.log("products", product)
  //   return product;
  // }

  async getProductNameByUsername(
    username: string,
  ): Promise<ProductInfo[] | null> {
    try {
      // Find the document and project only the `products` field
      const workExperience = await this.workExprience
        .findOne({ username })
        .select('products') // Only select the `products` field
        .exec();

      // If the work experience document is found, return the `products` field
      return workExperience ? workExperience.products : null;
    } catch (error) {
      console.error('Error fetching products by username:', error);
      return null;
    }
  }

  async getProfileByUsername3(username: string): Promise<Categories | null> {
    return this.categories.findOne({ username }).exec();
  }

  // async getProfileByUserId(username: string): Promise<PersonalProfile> {
  //   return this.profileModel.findOne({ username }).exec();
  // }

  async getProfileWithUserInfo(username: string): Promise<any> {
    return this.profileModel.aggregate([
      {
        $match: { username } // Match the document in the PersonalProfile collection
      },
      {
        $lookup: {
          from: 'users', // The name of the collection you want to join
          localField: 'username',
          foreignField: 'username',
          as: 'user_info'
        }
      },
      {
        $unwind: {
          path: '$user_info', // Deconstruct the user_info array
          preserveNullAndEmptyArrays: true // Keep profiles even if no matching user is found
        }
      },
      {
        $addFields: {
          userType: { $ifNull: ['$user_info.userType', null] } // Add userType field to the root level, if it exists
        }
      },
      {
        $project: {
          _id: 0, // Exclude _id if you don't need it
          'user_info': 0 // Exclude user_info field if you don't want it in the final output
        }
      }
    ]).exec();
  }
  
  
  // get profile photo
  async getAllProfiles(): Promise<PersonalProfile[]> {
    try {
      const profiles = await this.profileModel
        .find()
        .select('username profilePhoto') // Specify the fields to include
        .exec();
      return profiles;
    } catch (error) {
      console.error("Error fetching profiles:", error);
      throw error; // or return an empty array or some default value
    }
  }
  
  
  
}
