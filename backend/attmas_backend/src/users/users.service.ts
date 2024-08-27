import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './create-user.dto';
import { Categories } from 'src/profile/schemas/category.schema';
import { MailerService } from 'src/common/service/UserEmailSend';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Categories.name) private categoriesModel: Model<Categories>,
    private mailerService: MailerService, // Inject MailerService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const isAlreadyExist = await this.findByUsername(rest.username);
    if (isAlreadyExist && isAlreadyExist.username === rest.username) {
      throw new ConflictException(`User with this email already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      ...rest,
      password: hashedPassword,
      // isAllProfileCompleted: false,
    });
    await createdUser.save();

    // Send email
    await this.mailerService.sendEmail(
      createdUser.username,
      'Welcome to Attmas Service',
      `Hello ${createdUser.firstName},\n\nThank you for registering with Attmas!\n\nBest regards,\nAttmas Team`,
    );

    return createdUser;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    return user;
  }

  async findUserWithJobsAndExhibitions(username: string): Promise<User> {
    const user = await this.userModel
      .findOne({ username })
      .populate('jobs')
      .populate('exhibitions')
      .exec();
    return user;
  }

  async updateUserTypes(username: string, userType: string): Promise<User> {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    user.userType = userType;
    return user.save();
  }

  async updateProfileCompletionStatus(username: string): Promise<User> {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    user.isAllProfileCompleted = true;
    return user.save();
  }

  async findUsersByUserType({
    userType,
    pageNumber,
    limitNumber,
    categories,
    subCategory,
    firstName,
    lastName,
    mobileNumber,
    username,
  }: {
    userType: string;
    pageNumber: number;
    limitNumber: number;
    categories: string;
    subCategory: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    username: string;
  }): Promise<any[]> {
    const skip = (pageNumber - 1) * limitNumber;
    const filterQuery: any = { userType };

    const allNativeFiltersArray = {
      firstName,
      lastName,
      mobileNumber,
      username,
    };

    for (const key in allNativeFiltersArray) {
      if (Object.prototype.hasOwnProperty.call(allNativeFiltersArray, key)) {
        const element = allNativeFiltersArray[key];
        if (element) {
          filterQuery[key] = new RegExp(element, 'i');
        }
        // if (!filterQuery.$or) {
        //   filterQuery.$or = [{ [key]: new RegExp(element, 'i') }];
        // } else {
        //   filterQuery.$or.push({ [key]: new RegExp(element, 'i') });
        // }
      }
    }

    // if (filter) {
    //   filterQuery.$or = [
    //     { firstName: new RegExp(filter, 'i') },
    //     { lastName: new RegExp(filter, 'i') },
    //   ];
    // }

    // Aggregate users with their personal profile data
    const users = await this.userModel
      .aggregate([
        {
          $lookup: {
            from: 'personalprofiles',
            localField: 'username',
            foreignField: 'username',
            as: 'personalProfileData',
          },
        },
        {
          $unwind: {
            path: '$personalProfileData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'categories', // Assuming the collection is named 'categories'
            localField: 'username',
            foreignField: 'username',
            as: 'categoryData',
          },
        },
        {
          $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'workexpriences', // Assuming the collection is named 'categories'
            localField: 'username',
            foreignField: 'username',
            as: 'workexpriencesData',
          },
        },
        {
          $unwind: {
            path: '$workexpriencesData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            ...filterQuery,
            ...(categories && {
              'categoryData.categories': { $in: categories.split(',') },
            }),
            ...(subCategory && {
              'categoryData.subcategories': { $in: subCategory.split(',') },
            }),
          },
        },
        { $skip: skip },
        { $limit: limitNumber },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            username: 1,
            userType: 1,
            mobileNumber: 1,
            personalProfilePhoto: '$personalProfileData.profilePhoto',
            categories: '$categoryData.categories', // Include categories field
            subcategories: '$categoryData.subcategories', // Include subcategories field
            sector: '$workexpriencesData.sector',
            organization: '$workexpriencesData.organization',
          },
        },
      ])
      .exec();

    // if (categories || subCategory) {
    //   const usernames = users.map((user) => user.username);

    //   const categoryFilter: any = { username: { $in: usernames } };
    //   if (categories) {
    //     categoryFilter['categories'] = categories;
    //   }
    //   if (subCategory) {
    //     categoryFilter['subcategories'] = subCategory;
    //   }

    //   // Apply additional filtering based on category and subcategory
    //   const categoryData = await this.categoriesModel
    //     .find(categoryFilter)
    //     .exec();
    //   const filteredUsernames = new Set(
    //     categoryData.map((cat) => cat.username),
    //   );

    //   console.log('filteredUsernames', filteredUsernames);

    //   return users.filter((user) => filteredUsernames.has(user.username));
    // }

    return users;
  }

  async findUsersByUserType1(
    userType: string,
  ): Promise<{ firstName: string; lastName: string; username: string }[]> {
    const filterQuery: any = { userType };
    const users = await this.userModel.find(filterQuery).exec();
    const userDetails = users.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    }));
    return userDetails;
  }

  async updateUserProfile(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    console.log('updateUserDto:', updateUserDto);
    console.log('Current user email:', user.username);

    if (updateUserDto.email && updateUserDto.email !== user.username) {
      console.log('Updating email...');
      const existingUser = await this.userModel
        .findOne({ username: updateUserDto.email })
        .exec();
      if (existingUser && existingUser._id.toString() !== id) {
        throw new ConflictException('Email is already in use');
      }
      console.log('existingUser', existingUser);
      user.username = updateUserDto.email;
    }

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    Object.assign(user, updateUserDto, { username: user.username });
    await user.save();
    console.log('Updated user:', user);
    return user;
  }
}
