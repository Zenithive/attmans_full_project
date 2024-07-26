import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InterestedUser } from './InterestedUser.schema';
import { User } from 'src/users/user.schema'; // Assuming User schema is in src/users directory
import { MailerService } from 'src/common/service/UserEmailSend'; // Assuming MailerService is in src/common/service

@Injectable()
export class InterestedUserService {
    constructor(
        @InjectModel('InterestedUser') private readonly interestedUserModel: Model<InterestedUser>,
        @InjectModel('User') private readonly userModel: Model<User>,
        private mailerService: MailerService, // Inject MailerService
    ) {}

    async create(createInterestedUserDto: any): Promise<InterestedUser> {
        const { username, firstName, lastName, mobileNumber, userId, exhibitionId,userType } = createInterestedUserDto;

        console.log('Create InterestedUser DTO:', createInterestedUserDto);

        // Check if the user exists by email
        const existingUser = await this.userModel.findOne({ username: username }).exec();

        console.log('Existing User:', existingUser);

        try {
            if (existingUser) {
                // Send "abc" message
                console.log('Sending "abc" email to:', username);
                await this.mailerService.sendEmail(
                    username,
                    'Existing User of Attmas',
                    `Hello ${existingUser.firstName},\n\nYou have already signed up for our Attmas service!\n\nBest regards,\nTeam Attmas`,
                );
                console.log('Email sent to existing user successfully.');
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
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }

        // Create interested user entry
        const createdUser = new this.interestedUserModel({ username, firstName, lastName, mobileNumber, exhibitionId, userId ,userType});
        console.log('Created InterestedUser:', createdUser);

        return createdUser.save();
    }
}
