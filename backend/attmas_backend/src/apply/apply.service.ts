import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Apply, ApplyDocument } from './apply.schema';
import { CreateApplyDto } from './apply.dto';
import { User, UserDocument } from 'src/users/user.schema';
import { EmailService } from 'src/common/service/email.service';
import { EmailService2 } from 'src/notificationEmail/Exebitionemail.service';
import { UsersService } from 'src/users/users.service';
import { ObjectId } from 'mongoose';
// import { ObjectId } from 'typeorm';
// import mongoose from 'mongoose';
import { UpdateStatusesDto } from './update-statuses.dto'; // Import the DTO

@Injectable()
export class ApplyService {
  [x: string]: any;
  constructor(
    @InjectModel(Apply.name)
    private ApplyModel: Model<ApplyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly emailService2: EmailService2,
  ) {}

  // async create(createApplyDto: CreateApplyDto): Promise<Apply> {
  //   // console.log("CreateApplyDto", createApplyDto)
  //   const createdApply = new this.ApplyModel(createApplyDto);
  //   // console.log("createdApply", createdApply)
  //   return createdApply.save();
  // }

  async create(createApplyDto: CreateApplyDto): Promise<Apply> {
    const existingApplication = await this.ApplyModel.findOne({
      userId: createApplyDto.userId,
      jobId: createApplyDto.jobId,
    }).exec();

    console.log('existingApplication', existingApplication);
    if (existingApplication) {
      throw new ConflictException('User has already applied for this job');
    }

    const createdApply = new this.ApplyModel(createApplyDto);
    await createdApply.save();

    const user = await this.userModel
      .findOne({ username: createApplyDto.username })
      .exec();
    if (user) {
      const emailText = `
        Hi ${user.firstName},

        A new application has been created:
        
        Title: ${createApplyDto.title}
        Description: ${createApplyDto.description}
        Budget: ${createApplyDto.Budget}
        Time Frame: ${createApplyDto.TimeFrame}

        Best regards,
        Your Team
      `;
      console.log(user.username);
      await this.emailService.sendEmail({
        to: user.username,
        subject: 'New Application Created',
        text: emailText,
      });
    }
    // console.log('createdApply', createdApply);

    return createdApply;
  }

  async findAll(): Promise<Apply[]> {
    return this.ApplyModel.find()
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
  }

  async findJobWithUser(id: string): Promise<ApplyDocument | null> {
    return this.ApplyModel.findById(id).populate('user').exec();
  }

  async findById(id: string): Promise<ApplyDocument | null> {
    return this.ApplyModel.findById(id).exec();
  }

  async approveApplication(id: string): Promise<Apply> {
    const application = await this.findById(id);
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    application.status = 'Approved';
    application.buttonsHidden = true;
    await application.save();

    const user = await this.userModel.findById(application.userId).exec();
    const adminUsers = await this.usersService.findUsersByUserType1('Admin');
    if (!adminUsers || adminUsers.length === 0) {
      throw new NotFoundException('No Admin users found');
    }
    const applyId = application._id.toString();
    for (const admin of adminUsers) {
      if (user) {
        await this.emailService2.sendApplicationStatusEmail(
          user.username,
          'Application Approved',
          applyId,
          application.title,
          'approved',
          admin.firstName,
          admin.lastName,
        );
      }
    }
    return application;
  }

  async rejectApplication(id: string, rejectComment: string): Promise<Apply> {
    const application = await this.findById(id);
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    application.status = 'Rejected';
    application.rejectComment = rejectComment;
    application.buttonsHidden = true;
    await application.save();

    const user = await this.userModel.findById(application.userId).exec();
    const adminUsers = await this.usersService.findUsersByUserType1('Admin');
    if (!adminUsers || adminUsers.length === 0) {
      throw new NotFoundException('No Admin users found');
    }
    const applyId = application._id.toString();
    for (const admin of adminUsers) {
      if (user) {
        await this.emailService2.sendApplicationStatusEmail(
          user.username,
          'Application Rejected',
          applyId,
          application.title,
          'rejected',
          admin.firstName,
          admin.lastName,
        );
      }
    }
    return application;
  }
  async findByJobId(jobId: string): Promise<Apply[]> {
    return this.ApplyModel.find({ jobId })
      .populate('userId', 'firstName lastName username')
      .exec();
  }
  async findApplicationsByUserId(userId: string): Promise<Apply[]> {
    return this.ApplyModel.find({ userId }).exec();
  }

  async findAppliedJobs(userId: string): Promise<Apply[]> {
    return this.ApplyModel.find({ userId }).exec();
  }

  async findJobDetails(jobId: string): Promise<Apply[]> {
    return this.ApplyModel.find({ jobId })
      .populate('userId', 'firstName lastName username')
      .exec();
  }

 
  // async rewardApplication(id: string): Promise<Apply> {
  //   // Use findById to automatically handle ObjectId conversion
  //   const application = await this.ApplyModel.findById(id).where('status').equals('Approved').exec();
    
  //   if (!application) {
  //     throw new NotFoundException(`Application with id ${id} and reward status 'Pending' not found`);
  //   }
    
  //   application.status = 'Awarded';
  //   await application.save();
    
  //   return application;
  // }

  async rewardApplication(id: string): Promise<Apply> {
    const application = await this.ApplyModel.findById(id).exec();
    
    if (!application || application.status !== 'Approved') {
      throw new NotFoundException(`Application with id ${id} and status 'Approved' not found`);
    }

    // First, update the status of the selected application to 'Awarded'
    application.status = 'Awarded';
    await application.save();

    // Get all other applications and set their status to 'Not Awarded'
    const otherApplications = await this.ApplyModel.find({
      _id: { $ne: id },
      status: { $in: ['Approved', 'Awarded'] },
    }).exec();

    const updatedApplications = otherApplications.map(app => ({
      _id: app._id.toString(),
      status: 'Not Awarded',
    }));

    await this.updateStatuses({ applications: updatedApplications });

    return application;
  }
  

  // async updateStatuses(updateUnawaredDto: UpdateUnawaredDto): Promise<void> {
  //   const { applications } = updateUnawaredDto;
  //   for (const app of applications) {
  //     const application = await this.ApplyModel.findById(app._id).exec();
  //     if (!application) {
  //       throw new NotFoundException(`Application with id ${app._id} not found`);
  //     }
  //     application.status = 'Not Awarded';
  //     await application.save();
  //   }
  // }

  async updateStatuses(updateStatusesDto: UpdateStatusesDto): Promise<void> {
    const { applications } = updateStatusesDto;

    // Update the status of each application
    const bulkOperations = applications.map(app => ({
      updateOne: {
        filter: { _id: app._id },
        update: { status: app.status },
      },
    }));

    await this.ApplyModel.bulkWrite(bulkOperations);
  }
}
