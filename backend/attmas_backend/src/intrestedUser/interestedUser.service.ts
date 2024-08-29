import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InterestedUser } from './InterestedUser.schema';
import { User } from 'src/users/user.schema'; // Assuming User schema is in src/users directory
import { MailerService } from 'src/common/service/UserEmailSend'; // Assuming MailerService is in src/common/service
import { Exhibition } from 'src/exhibition/schema/exhibition.schema';
import { Booth } from 'src/booth/booth.schema';

@Injectable()
export class InterestedUserService {
  constructor(
    @InjectModel('InterestedUser')
    private readonly interestedUserModel: Model<InterestedUser>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private mailerService: MailerService, // Inject MailerService
    @InjectModel('Exhibition')
    private readonly exhibitionModel: Model<Exhibition>,
    @InjectModel('Booth')
    private readonly boothModel: Model<Booth>,
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

    const existingInterest = await this.interestedUserModel
      .findOne({ userId, boothId, interestType: 'InterestedUserForBooth' })
      .exec();

    if (existingInterest) {
      throw new Error('User has already shown interest in this booth');
    }

    try {
      const exhibition = await this.exhibitionModel
        .findById(exhibitionId)
        .exec();

      if (!exhibition) {
        throw new Error('Exhibition not found');
      }

      const adminEmail = exhibition.username;
      console.log('Exhibition Admin Email:', adminEmail);

      let boothTitle: string | undefined;
      if (boothId) {
        const booth = await this.boothModel
          .findById(boothId)
          .select('title')
          .exec();
        boothTitle = booth?.title;
      }

      // Check if the user exists by username
      const existingUser = await this.userModel
        .findOne({ username: username })
        .exec();

      if (existingUser) {
        // Send "abc" message
        const backendBaseUrl = process.env.BACKEND_BASE_URL;

        const exhibitionUrl = `${backendBaseUrl}/view-exhibition?exhibitionId=${exhibitionId}`;
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
          boothTitle,
          interestType,
          adminEmail,
        });

        await createdUser.save();

        console.log('Attempting to send email to admin:', adminEmail);
        await this.mailerService.sendEmail(
          adminEmail,
          'New Booth Interest',
          `Hello,\n\nA new user has shown interest in The booth "${boothTitle}". Please review their details in the system.\n\nBest regards,\nTeam Attmas`,
        );
        console.log('Email sent to exhibition admin successfully.');

        return createdUser;
      } else {
        // Send "xyz" message
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
          adminEmail,
        });

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
