import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InterestedUser } from './InterestedUser.schema';
import { User } from 'src/users/user.schema'; // Assuming User schema is in src/users directory
import { MailerService } from 'src/common/service/UserEmailSend'; // Assuming MailerService is in src/common/service

@Injectable()
export class InterestedUserService {
  constructor(
    @InjectModel('InterestedUser')
    private readonly interestedUserModel: Model<InterestedUser>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private mailerService: MailerService, // Inject MailerService
  ) {}

  async create(createInterestedUserDto: any): Promise<InterestedUser> {
    const {
      username,
      firstName,
      lastName,
      mobileNumber,
      userId,
      exhibitionId,
      boothId,
      userType,
      interestType,
    } = createInterestedUserDto;

    console.log('Create InterestedUser DTO:', createInterestedUserDto);

    // Check if the user exists by username
    const existingUser = await this.userModel
      .findOne({ username: username })
      .exec();
    console.log('Existing User:', existingUser);

    try {
      if (existingUser) {
        // Send "abc" message
        const backendBaseUrl = process.env.BACKEND_BASE_URL;

        console.log('BACKEND_BASE_URL:', backendBaseUrl);
        const exhibitionUrl = `${backendBaseUrl}/view-exhibition?exhibitionId=${exhibitionId}`;
        console.log('Sending "abc" email to:', username);
        await this.mailerService.sendEmail(
          username,
          'Existing User of Attmas',
          `Hello ${existingUser.firstName},\n\nYou have already signed up for our Attmas service!\n\nClick <a href="${exhibitionUrl}">here</a> to participate in the Exhibition.\n\nBest regards,\nTeam Attmas`,
        );
        console.log('Email sent to existing user successfully.');

        // Create interested user entry with null or blank values
        const createdUser = new this.interestedUserModel({
          username,
          firstName,
          lastName,
          mobileNumber,
          exhibitionId,
          boothId,
          userId,
          userType,
          interestType,
        });
        console.log('Created InterestedUser with null values:', createdUser);

        // Save and then delete the null entry
        await createdUser.save();

        return createdUser;
      } else {
        // Send "xyz" message
        console.log('Sending "xyz" email to:', username);
        await this.mailerService.sendEmail(
          username,
          'New User Interest in Attmas',
          `Hello ${firstName},\n\nThank you for showing interest in our Attmas service!\n\nBest regards,\nTeam Attmas`,
        );
        console.log('Email sent to new user successfully.');

        // Send welcome email
        console.log('Sending welcome email to new user:', username);
        await this.mailerService.sendEmail(
          username,
          'Welcome to Attmas!',
          `Hello ${firstName},\n\nWelcome to Attmas! We're excited to have you on board.\n\nBest regards,\nTeam Attmas`,
        );
        console.log('Welcome email sent to new user successfully.');

        // Create interested user entry with provided values
        const createdUser = new this.interestedUserModel({
          username,
          firstName,
          lastName,
          mobileNumber,
          exhibitionId,
          boothId,
          userId,
          userType,
        });
        console.log('Created InterestedUser:', createdUser);

        return createdUser.save();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async findExhibitionsByUser(userId: string): Promise<InterestedUser[]> {
    return this.interestedUserModel.find({ userId }).exec();
  }

  async findVisitorsByExhibition(
    exhibitionId: string,
  ): Promise<InterestedUser[]> {
    return this.interestedUserModel.find({ exhibitionId }).exec();
  }

  async findVisitorsByBooth(boothId: string): Promise<InterestedUser[]> {
    return this.interestedUserModel.find({ boothId }).exec();
  }

  async findVisitorsByBoothAndExhibition(
    boothId: string,
    exhibitionId: string,
  ): Promise<InterestedUser[]> {
    return this.interestedUserModel
      .find({
        boothId,
        exhibitionId,
        interestType: 'InterestedUserForBooth',
      })
      .exec();
  }

  async findVisitorsByInterestType(
    interestType: string,
  ): Promise<InterestedUser[]> {
    return this.interestedUserModel
      .find({
        interestType,
      })
      .exec();
  }
}
