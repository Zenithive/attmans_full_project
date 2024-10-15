import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InterestedUser } from './InterestedUser.schema';
import { User } from 'src/users/user.schema'; // Assuming User schema is in src/users directory
import { MailerService } from 'src/common/service/UserEmailSend'; // Assuming MailerService is in src/common/service
import { Exhibition } from 'src/exhibition/schema/exhibition.schema';
import { Booth } from 'src/booth/booth.schema';
import { Email } from 'src/notificationEmail/Exebitionemail.schema';

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
    @InjectModel(Email.name)
    private emailModel: Model<Email>,
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

    // Convert userId and exhibitionId to ObjectId
    const userObjectId = new Types.ObjectId(userId as string);
    const exhibitionObjectId = new Types.ObjectId(exhibitionId as string);
    let newBoothId: Types.ObjectId | null = null;

    // Set boothId to null if interestType is 'InterestedUserForExhibition'
    if (interestType === 'InterestedUserForExhibition') {
      newBoothId = null;
    } else if (boothId) {
      newBoothId = new Types.ObjectId(boothId as string);
    }
  
    // Modify query to check both booth-specific and exhibition-wide interests
    const existingInterest = await this.interestedUserModel.findOne({
      userId: userObjectId,
      exhibitionId: exhibitionObjectId,
      interestType,
      boothId: newBoothId ? newBoothId : null, // Check against null if boothId is for exhibition
    }).exec();
  
    if (existingInterest) {
      throw new Error('User has already shown interest in this exhibition/booth');
    }

    try {
      const exhibition = await this.exhibitionModel
        .findById(exhibitionObjectId)
        .exec();

      if (!exhibition) {
        throw new Error('Exhibition not found');
      }

      const adminEmail = exhibition.username;
      const exhibitionName = exhibition.title;

      let boothTitle: string | undefined;
      if (newBoothId) {
        const booth = await this.boothModel
          .findById(newBoothId)
          .select('title')
          .exec();
        boothTitle = booth?.title;
      }

      // Check if the user exists by username
      const existingUser = await this.userModel
        .findOne({ username: username })
        .exec();

      if (existingUser) {
        // Create interested user entry with null or blank values
        const createdUser = new this.interestedUserModel({
          username,
          firstName,
          lastName,
          mobileNumber,
          exhibitionId: exhibitionObjectId,
          boothId: newBoothId,
          userId: userObjectId,
          userType,
          boothTitle,
          interestType,
          adminEmail,
          exhibitionName,
        });

        // Send email to the admin about the new booth interest if applicable
        if (interestType === 'InterestedUserForBooth') {
          this.sendInterestNotificationEmail(adminEmail, boothTitle || '');
          await this.saveEmailData(
            adminEmail,
            'New Booth Interest',
            exhibitionId,
            username,
            boothTitle || '',
            exhibitionName || '',
          );
        } else if (interestType === 'InterestedUserForExhibition') {
          this.sendInterestNotificationEmailtoAdmin(adminEmail, exhibitionName);
          await this.saveEmailData(
            adminEmail,
            'New Exhibition Interest',
            exhibitionId,
            username,
            exhibitionName,
            exhibitionName || '',
          );
        }

        return await createdUser.save();
      } else {
        // Send email to the user and welcome email
        this.sendUserInterestEmail(username, firstName);
        this.sendWelcomeEmail(username, firstName);

        // Create interested user entry with provided values
        const createdUser = new this.interestedUserModel({
          username,
          firstName,
          lastName,
          mobileNumber,
          exhibitionId: exhibitionObjectId,
          boothId: newBoothId,
          userId: userObjectId,
          userType,
          adminEmail,
        });
        
        return await createdUser.save();
      }
    } catch (error) {
      console.error('Error handling create interested user:', error);
      throw error;
    }
  }

  async saveEmailData(
    to: string,
    subject: string,
    exhibitionId: string,
    boothUsername: string,
    boothTitle: string | undefined,
    exhibitionName: string | undefined,
  ) {
    const email = new this.emailModel({
      to,
      subject,
      exhibitionId,
      boothUsername,
      read: false,
      sentAt: new Date(),
      boothTitle,
      exhibitionName,
    });

    await email.save();
  }

  // Define methods for sending different types of emails
  async sendInterestNotificationEmail(adminEmail: string, boothTitle: string) {
    const subject = 'New Booth Interest';
    const body = `Hello,\n\nA new user has shown interest in The booth "${boothTitle}". Please review their details in the system.\n\nBest regards,\nTeam Attmans`;
    await this.mailerService.sendEmail(adminEmail, subject, body);
  }

  async sendInterestNotificationEmailtoAdmin(
    adminEmail: string,
    exhibitionName: string,
  ) {
    const subject = 'New Exhibition Interest';
    const body = `Hello,\n\nA new user has shown interest in The Exhibition "${exhibitionName}". Please review their details in the system.\n\nBest regards,\nTeam Attmans`;
    await this.mailerService.sendEmail(adminEmail, subject, body);
  }

  async sendUserInterestEmail(username: string, firstName: string) {
    const subject = 'New User Interest in Attmans';
    const body = `Hello ${firstName},\n\nThank you for showing interest in our Attmans service!\n\nBest regards,\nTeam Attmans`;
    await this.mailerService.sendEmail(username, subject, body);
  }

  async sendWelcomeEmail(username: string, firstName: string) {
    const subject = 'Welcome to Attmans!';
    const body = `Hello ${firstName},\n\nWelcome to Attmans! We're excited to have you on board.\n\nBest regards,\nTeam Attmans`;
    await this.mailerService.sendEmail(username, subject, body);
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
    exhibitionId: string,
  ): Promise<InterestedUser[]> {
    return this.interestedUserModel
      .find({
        interestType,
        exhibitionId: new Types.ObjectId(exhibitionId),
      })
      .exec();
  }
}
