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
import { MailerService } from 'src/common/service/UserEmailSend';
import {
  decryptWithCrypto,
  encryptWithCrypto,
  getMinutesElapsed,
} from 'src/common/service/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
    });

    await createdUser.save();

    const verificationLink = `${process.env.SERVER_URL_FOR_EMAIL_VERIFY}/users/updateEmailStatus/${createdUser._id}`;

    const emailBody = `
        <p>Hello ${createdUser.firstName},</p>
        <p>Thank you for registering with Attmans!</p>
        <p>Please verify your email by clicking the button below:</p>
        <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;background-color:#28a745;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
        <p>Best regards,<br>Attmans Team</p>
    `;

    this.mailerService.sendEmail(
      createdUser.username,
      'Verify Email',
      emailBody,
      // true // Indicating it's an HTML email
    );

    // Send a welcome email
    const welcomeEmailBody = `
        <p>Hello ${createdUser.firstName},</p>
        <p>Thank you for registering with Attmans!</p>
        <p>Best regards,<br>Attmans Team</p>
    `;

    this.mailerService.sendEmail(
      createdUser.username,
      'Welcome to Attmans Service',
      welcomeEmailBody,
      // true // Also HTML formatted email
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
    const filterQuery: any = {};

    const allNativeFiltersArray = {
      firstName,
      lastName,
      userType,
      mobileNumber,
      username,
    };

    for (const key in allNativeFiltersArray) {
      if (Object.prototype.hasOwnProperty.call(allNativeFiltersArray, key)) {
        const element = allNativeFiltersArray[key];
        if (element) {
          filterQuery[key] = new RegExp(element, 'i');
        }
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
            Headline: '$workexpriencesData.Headline',
            hasPatent: '$workexpriencesData.hasPatent',
            patentDetails: '$workexpriencesData.patentDetails',
            productToMarket: '$workexpriencesData.productToMarket',
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

    //   return users.filter((user) => filteredUsernames.has(user.username));
    // }

    return users;
  }

  async findUsersByUserType1(userType: string): Promise<
    {
      firstName: string;
      lastName: string;
      username: string;
      userType: string;
    }[]
  > {
    const filterQuery: any = { userType };
    const users = await this.userModel.find(filterQuery).exec();
    const userDetails = users.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      userType: user.userType,
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

    if (updateUserDto.email && updateUserDto.email !== user.username) {
      const existingUser = await this.userModel
        .findOne({ username: updateUserDto.email })
        .exec();
      if (existingUser && existingUser._id.toString() !== id) {
        throw new ConflictException('Email is already in use');
      }
      user.username = updateUserDto.email;
    }

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    Object.assign(user, updateUserDto, { username: user.username });
    await user.save();
    return user;
  }

  async updateEmailVerificationStatus(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.isEmailVerified = true;
    await user.save();
    return user;
  }

  async setResetPasswordFlag(username: string): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate({ username }, { $set: { resetPassword: true } })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with email: ${username} not found`);
    }

    this.sendResetPasswordMail(user);
    return user;
  }

  async resetUserPassword(
    resetPasswordId: string,
    password: string,
  ): Promise<User> {
    if (resetPasswordId) {
      const { id, expirationTime } = decryptWithCrypto(resetPasswordId);
      console.log('expirationTime', expirationTime);
      const isTimeExpired = getMinutesElapsed(expirationTime);
      if (-15 < isTimeExpired && isTimeExpired < 0) {
        console.log('isTimeExpired', isTimeExpired);
        console.log('id', id);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel
          .findOneAndUpdate(
            { _id: id, resetPassword: true },
            { $set: { resetPassword: false, password: hashedPassword } },
          )
          .exec();

        console.log('user', user);
        if (!user) {
          throw new NotFoundException(`This link is not valid for any user.`);
        }
        return user;
      } else {
        throw new NotFoundException(`This link is expired`);
      }
    } else {
      throw new NotFoundException(`This link is not valid or expired`);
    }
  }

  sendResetPasswordMail(user) {
    const encryptUserId = encryptWithCrypto(user._id);
    console.log('encryptUserId', encryptUserId);
    const verificationLink = `${process.env.BACKEND_BASR_URL}/reset-password?id=${encryptUserId}`;

    const emailBody = `
        <p>Hello ${user.firstName},</p>
        <p>We received a request to reset your password for your Attmans account. If you made this request, click the link below to reset your password!</p>
        <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;background-color:#28a745;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
        <p>Best regards,<br>Attmans Team</p>
    `;

    this.mailerService.sendEmail(
      user.username,
      'Reset Your Password for Attmans',
      emailBody,
      // true // Indicating it's an HTML email
    );
  }
}
