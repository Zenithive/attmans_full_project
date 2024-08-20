import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Apply, ApplyDocument } from './apply.schema';
import { CreateApplyDto } from './apply.dto';
import { User, UserDocument } from 'src/users/user.schema';
import { EmailService } from 'src/common/service/email.service';
import { EmailService2 } from 'src/notificationEmail/Exebitionemail.service';
import { UsersService } from 'src/users/users.service';
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



  // async findAllMyProject(userId: string): Promise<Apply[]> {
  //   console.log('UserId received:', userId); // Log the received userId
  
  //   // Check if userId is a valid ObjectId
  //   if (!Types.ObjectId.isValid(userId)) {
  //     throw new Error('Invalid userId format');
  //   }
  
  //   // Query to find documents with the given userId and status 'Awarded'
  //   return this.ApplyModel.find({ 
  //       userId: userId, 
  //       status: 'Awarded' 
  //     })
  //     .populate('userId', 'firstName lastName username', this.userModel)
  //     .exec()
  //     .then(results => {
  //       console.log("Results:", results); // Log the results
  //       return results;
  //     });
  // }


  // async findAllMyProject(userId: string): Promise<Apply[]> {
  //   console.log('UserId received:', userId); // Log the received userId
  
  //   // Check if userId is a valid ObjectId
  //   if (!Types.ObjectId.isValid(userId)) {
  //     throw new Error('Invalid userId format');
  //   }
  
  //   return this.ApplyModel.aggregate([
  //     // Stage 1: Match documents by userId and status
  //     {
  //       $match: {
  //         userId: userId,
  //         status: 'Awarded',
  //       },
  //     },
  //     // Stage 2: Lookup to get job details from the Job collection
  //     {
  //       $lookup: {
  //         from: 'jobs', // Name of the Job collection
  //         localField: 'jobId', // Field from Apply collection
  //         foreignField: '_id', // Field from Job collection
  //         as: 'jobDetails' // Output array field
  //       },
  //     },
  //     // Stage 3: Unwind the jobDetails array to get individual job detail documents
  //     {
  //       $unwind: {
  //         path: '$jobDetails',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     // Stage 4: Project fields to include in the result
  //     {
  //       $project: {
  //         jobTitle: '$jobDetails.title',
  //         jobCurrency: '$jobDetails.currency',
  //         description: '$jobDetails.description',
  //         Objective: '$jobDetails.Objective',
  //         Expectedoutcomes: '$jobDetails.Expectedoutcomes',
  //         IPRownership: '$jobDetails.IPRownership',
  //         Expertiselevel: '$jobDetails.Expertiselevel',
  //         DetailsOfInnovationChallenge: '$jobDetails.DetailsOfInnovationChallenge',
  //         Sector: '$jobDetails.Sector',
  //         AreaOfProduct: '$jobDetails.AreaOfProduct',
  //         ProductDescription: '$jobDetails.ProductDescription',
  //         Category: '$jobDetails.Category',
  //         Subcategorys: '$jobDetails.Subcategorys',
  //         SelectService: '$jobDetails.SelectService',
  //         TimeFrame: '$jobDetails.TimeFrame',
  //         Budget: '$jobDetails.Budget',
  //         userId: 1,
  //         status: 1,
  //         buttonsHidden: 1,
  //         username: '$userId.username', // Assuming you also want to include username from the Apply document
  //         createdAt: 1,
  //         comments: 1,
  //         firstName: '$userId.firstName', // Assuming you have populated this field
  //         lastName: '$userId.lastName', // Assuming you have populated this field
  //       },
  //     },
  //   ])
  //   .then(results => {
  //     console.log("Results:", results); // Log the results
  //     return results;
  //   });
  // }

  async findAllMyProject(userId: string): Promise<any[]> {
    console.log('UserId received:', userId); // Log the received userId
  
    // Check if userId is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId format');
    }

    try{

    const results = await this.ApplyModel.aggregate([
      // Stage 1: Match documents by userId and status
      {
        $match: {
          userId: userId,
          status: 'Awarded',
        },
      },
      // Stage 2: Project fields for debugging before lookup
      {
        $project: {
          _id: 1, // Include the document's _id
          title: 1, // Include title from Apply collection
        },
      },
      // Stage 3: Lookup to get job details from the jobs collection
      {
        $lookup: {
          from: 'jobs', // Ensure this matches the actual collection name
          localField: 'title', // Field in Apply collection
          foreignField: 'title', // Field in Job collection
          as: 'jobDetails', // Output array field
        },
      },
      // Stage 4: Unwind the jobDetails array
      {
        $unwind: {
          path: '$jobDetails',
          preserveNullAndEmptyArrays: true, // Keep results even if no matching job
        },
      },
      // Stage 5: Project final fields including the sector from jobDetails
      {
        $project: {
          _id: 1, // Include the document's _id
          title: 1, // Include title for reference
          jobDetails: 1, // Include entire jobDetails for debugging
        },
      },
    ]);

    // Log the results to see values of title and jobDetails
    console.log("Aggregation Results:", JSON.stringify(results, null, 2));

    return results;
  } catch (error) {
    console.error('Aggregation error:', error);
    throw new Error('Error fetching projects');
  }
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

  async rewardApplication(
    id: string,
    jobId: string,
    comment: string,
  ): Promise<Apply> {
    // console.log(`Rewarding application with ID: ${id}`);

    const application = await this.ApplyModel.findById(id).exec();

    if (!application || application.status !== 'Approved') {
      throw new NotFoundException(
        `Application with id ${id} and status 'Approved' not found`,
      );
    }

    // First, update the status of the selected application to 'Awarded'
    application.status = 'Awarded';
    application.comment_Reward_Nonreward =
      comment ||
      'congratulation , you are the 100% confirm person for the Project who is awarded';
    await application.save();
    // console.log(`Application with ID: ${id} awarded.`);

    // Get all other applications and set their status to 'Not Awarded'
    const otherApplications = await this.ApplyModel.find({
      _id: { $ne: id },
      jobId: application.jobId,
      status: { $in: ['Approved', 'Awarded'] },
    }).exec();

    const updatedApplications = otherApplications.map((app) => ({
      _id: app._id.toString(),
      status: 'Not Awarded',
      jobId: app.jobId.toString(),
      comment_Reward_Nonreward:
        'Thank you for your application. Although we cannot award this application, we value your interest and encourage you to apply for other roles or opportunities with us in the future.', // Default comment
      userId: app.userId.toString(),
      username: app.username.toString(),
    }));

    // console.log('Applications to be updated:', updatedApplications);

    await this.updateStatuses({ applications: updatedApplications });
    // Send notification emails
    const user = await this.userModel.findById(application.userId).exec();
    if (user) {
      await this.emailService.sendAwardedEmail({
        to: user.username,
        applicationTitle: application.title,
      });
    }

    for (const app of updatedApplications) {
      const otherUser = await this.userModel.findById(app.userId).exec();
      if (otherUser) {
        await this.emailService.sendNotAwardedEmail({
          to: otherUser.username,
          applicationTitle: application.title,
        });
      }
    }

    return application;
  }

  async updateStatuses(updateStatusesDto: UpdateStatusesDto): Promise<void> {
    const { applications } = updateStatusesDto;

    // console.log('Updating statuses for applications:', applications);

    // Update the status of each application
    const bulkOperations = applications.map((app) => ({
      updateOne: {
        filter: { _id: app._id, jobId: app.jobId },
        update: {
          status: app.status,
          comment_Reward_Nonreward: app.comment_Reward_Nonreward || '',
        },
      },
    }));

    // console.log('Bulk operations prepared:', bulkOperations);

    await this.ApplyModel.bulkWrite(bulkOperations);
    // console.log('Bulk operations executed.');
  }
}
