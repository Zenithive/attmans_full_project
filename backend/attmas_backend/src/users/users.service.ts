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
    const user = await this.userModel.findById({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userModel
        .findOne({ username: updateUserDto.username })
        .exec();
      console.log('existingUser', existingUser);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new ConflictException('Email is already in use');
      }
    }

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    Object.assign(user, updateUserDto);
    await user.save();
    console.log('user', user);
    return user;
  }
}
