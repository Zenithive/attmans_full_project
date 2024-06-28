import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './create-user.dto';
import { Categories } from 'src/profile/schemas/category.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Categories.name) private categoriesModel: Model<Categories>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      ...rest,
      password: hashedPassword,
      isAllProfileCompleted: false,
    });
    return createdUser.save();
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

  async findUsersByUserType(
    userType: string,
    page: number,
    limit: number,
    filter: string,
    category: string,
    subCategory: string,
  ): Promise<User[]> {
    const skip = (page - 1) * limit;
    const filterQuery: any = { userType };

    if (filter) {
      filterQuery.$or = [
        { firstName: new RegExp(filter, 'i') },
        { lastName: new RegExp(filter, 'i') },
      ];
    }

    const users = await this.userModel
      .find(filterQuery)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .exec();

    if (category || subCategory) {
      const usernames = users.map((user) => user.username);

      const categoryFilter: any = { username: { $in: usernames } };
      if (category) {
        categoryFilter['categories'] = category;
      }
      if (subCategory) {
        categoryFilter['subcategories'] = subCategory;
      }

      const categoryData = await this.categoriesModel
        .find(categoryFilter)
        .exec();
      const filteredUsernames = new Set(
        categoryData.map((cat) => cat.username),
      );

      return users.filter((user) => filteredUsernames.has(user.username));
    }

    return users;
  }

  async findUsersByUserType1(
    userType: string,
    page: number,
    limit: number,
  ): Promise<User[]> {
    const skip = (page - 1) * limit;
    const filterQuery: any = { userType };

    const users = await this.userModel
      .find(filterQuery)
      .skip(skip)
      .limit(limit)
      .exec();
    console.log('Susers', users);
    return users;
  }

  async updateUserCategories(username: string): Promise<void> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const categoriesData = await this.categoriesModel
      .findOne({ username })
      .exec();
    console.log('categoriesData', categoriesData);

    if (categoriesData) {
      // Add categories and subcategories to user without removing existing ones
      if (categoriesData.categories && categoriesData.categories.length > 0) {
        user.categories = [
          ...new Set([...user.categories, ...categoriesData.categories]),
        ];
      }
      if (
        categoriesData.subcategories &&
        categoriesData.subcategories.length > 0
      ) {
        user.subcategories = [
          ...new Set([...user.subcategories, ...categoriesData.subcategories]),
        ];
      }

      await user.save();
    }
  }
}
