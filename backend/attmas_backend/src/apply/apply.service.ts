import {
  BadRequestException,
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
import { Proposal } from 'src/proposal/proposal.schema';

import {
  APPLY_STATUSES,
  PROPOSAL_STATUSES,
} from 'src/common/constant/status.constant';
import { getSameDateISOs } from 'src/services/util.services';

@Injectable()
export class ApplyService {
  constructor(
    @InjectModel(Apply.name)
    private ApplyModel: Model<ApplyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,
    private usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly emailService2: EmailService2,
  ) {}

  async create(createApplyDto: CreateApplyDto): Promise<Apply> {
    // Convert jobId to ObjectId if it is not already
    let userId: Types.ObjectId;
    let jobId: Types.ObjectId;

    try {
      userId = new Types.ObjectId(createApplyDto.userId);
    } catch (error) {
      throw new BadRequestException('Invalid userId format');
    }
    try {
      jobId = new Types.ObjectId(createApplyDto.jobId);
    } catch (error) {
      throw new BadRequestException('Invalid jobId format');
    }

    // Check for existing application
    const existingApplication = await this.ApplyModel.findOne({
      userId: userId,
      jobId: jobId,
    }).exec();

    console.log('existingApplication', existingApplication);
    if (existingApplication) {
      throw new ConflictException('User has already applied for this job');
    }

    // Create and save new application
    const createdApply = new this.ApplyModel({
      ...createApplyDto,
      userId: userId,
      jobId: jobId,
    });
    await createdApply.save();
    this.applyNotification(createApplyDto);
    // Find user and send email notification

    return createdApply;
  }

  async applyNotification(createApplyDto) {
    const user = await this.userModel
      .findOne({ username: createApplyDto.username })
      .exec();
    const adminUsers = await this.usersService.findUsersByUserType1('Admin');
    if (!adminUsers || adminUsers.length === 0) {
      throw new NotFoundException('No Admin users found');
    }
    for (const admin of adminUsers) {
      if (admin) {
        this.emailService2.sendEmailApplyCreate(
          admin.username,
          `New Application Created for Project: ${createApplyDto.title}`,
          createApplyDto.jobId,
          createApplyDto.title,
          admin.firstName,
          admin.lastName,
          createApplyDto,
        );
      }
    }
    if (user) {
      this.emailService2.sendEmailApplyCreate(
        user.username,
        `New Application Created for Project: ${createApplyDto.title}`,
        createApplyDto.jobId,
        createApplyDto.title,
        user.firstName,
        user.lastName,
        createApplyDto,
      );
    }
  }

  async findAll(): Promise<Apply[]> {
    return this.ApplyModel.find()
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
  }

  async findAllMyProject(userId: string): Promise<any[]> {
    console.log('UserId received:', userId); // Log the received userId

    // Check if userId is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId format');
    }

    try {
      const results = await this.ApplyModel.aggregate([
        // Stage 1: Match documents by userId and status
        {
          $match: {
            userId: userId,
            status: {
              $in: [APPLY_STATUSES.awarded],
            },
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
      console.log('Aggregation Results:', JSON.stringify(results, null, 2));

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
    //application.status = 'Approved';
    if (application.applyType === 'InnovatorsApply') {
      application.status =
        APPLY_STATUSES.approvedPendingForProposalForInnovators;
    } else {
      application.status = APPLY_STATUSES.approvedPendingForProposal;
    }
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
        this.emailService2.sendApplicationStatusEmail(
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
    application.status = APPLY_STATUSES.rejected;
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
        this.emailService2.sendApplicationStatusEmail(
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

  async findByJobId(jobId: Types.ObjectId): Promise<Apply[]> {
    // Convert jobId to ObjectId if it is a valid string
    let jobObjectId: Types.ObjectId;
    if (Types.ObjectId.isValid(jobId)) {
      jobObjectId = new Types.ObjectId(jobId);
    } else {
      throw new Error('Invalid jobId format');
    }

    return this.ApplyModel.find({ jobId: jobObjectId })
      .populate('userId', 'firstName lastName username')
      .exec();
  }

  async findApplicationsByUserId(userId: string): Promise<Apply[]> {
    return this.ApplyModel.find({ userId }).exec();
  }

  async findAppliedJobs(
    userId?: string,
    projTitle?: string,
    Category?: string,
    Subcategorys?: string,
    jobId?: string,
  ): Promise<any[]> {
    try {
      const filterQuery: any = {};

      const allNativeFiltersArray = {};

      for (const key in allNativeFiltersArray) {
        if (Object.prototype.hasOwnProperty.call(allNativeFiltersArray, key)) {
          const element = allNativeFiltersArray[key];
          const elementValue = Array.isArray(element)
            ? element.length
            : element;
          if ((key === 'createdAt' || key === 'TimeFrame') && element) {
            const sameDateISOs = getSameDateISOs(element);
            filterQuery[key] = {
              $gte: sameDateISOs.startOfDay,
              $lte: sameDateISOs.endOfDay,
            };
          } else if (elementValue) {
            filterQuery[key] = new RegExp(element, 'i');
          }
        }
      }

      const results = await this.ApplyModel.aggregate([
        {
          $lookup: {
            from: 'proposals',
            localField: '_id',
            foreignField: 'applyId',
            as: 'proposalsDetails',
          },
        },
        {
          $unwind: {
            path: '$proposalsDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'jobs', // Name of the Jobs collection
            localField: 'title', // Field from the Apply collection
            foreignField: 'title', // Field from the Jobs collection to match
            as: 'jobDetails', // Name of the output array field
          },
        },
        // Optionally, unwind the jobDetails array to get a single document per match
        { $unwind: { path: '$jobDetails', preserveNullAndEmptyArrays: true } },
        {
          $match: {
            ...(userId && { userId: new Types.ObjectId(userId) }),
            ...(projTitle && {
              'jobDetails.title': new RegExp(projTitle, 'i'),
            }),
            ...(Category && {
              'jobDetails.Category': new RegExp(Category, 'i'),
            }),
            ...(Subcategorys && {
              'jobDetails.Subcategorys': new RegExp(Subcategorys, 'i'),
            }),
            ...(jobId && {
              'jobDetails._id': new Types.ObjectId(jobId),
            }),
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            applyType: 1,
            SolutionUSP: 1,
            availableSolution: 1,
            buttonsHidden: 1,
            jobId: 1,
            rejectComment: 1,
            comment_Reward_Nonreward: 1,
            status: 1,
            lastName: 1,
            firstName: 1,
            username: 1,
            userId: 1,
            currency: 1,
            Budget: 1,
            createdAt: 1,
            TimeFrame: 1,
            proposalsDetails: {
              _id: 1,
              industryProblem: 1,
              impactProductOutput: 1,
              natureOfProject: 1,
              haveTechnology: 1,
              patentPreference: 1,
              projectObjective: 1,
              projectOutline: 1,
              marketNiche: 1,
              isPeerReviewed: 1,
              expectedOutcome: 1,
              detailedMethodology: 1,
              physicalAchievements: 1,
              budgetOutlay: 1,
              manpowerDetails: 1,
              pastCredentials: 1,
              briefProfile: 1,
              proposalOwnerCredentials: 1,
              otherCommitments: 1,
              progressReportTemplate: 1,
              milestones: 1,
              totalDaysCompletion: 1,
              labStrengths: 1,
              externalEquipment: 1,
              pilotProductionTesting: 1,
              mentoringRequired: 1,
            },
            jobDetails: 1,
          },
        },
      ]).exec();
      console.log('result for Applied Jobs', results);
      return results;
    } catch (error) {
      console.error('Error during aggregation:', error);
      throw error;
    }
  }

  async findAppliedJobsForAdmin(status: string): Promise<Apply[]> {
    const result = await this.ApplyModel.aggregate([
      // Match documents with the specified status
      { $match: { status } },

      // Use $lookup to join with the Jobs collection
      {
        $lookup: {
          from: 'jobs', // Name of the Jobs collection
          localField: 'title', // Field from the Apply collection
          foreignField: 'title', // Field from the Jobs collection to match
          as: 'jobDetails', // Name of the output array field
        },
      },

      // Optionally, unwind the jobDetails array to get a single document per match
      { $unwind: { path: '$jobDetails', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users', // Name of the Jobs collection
          localField: 'userId', // Field from the Apply collection
          foreignField: '_id', // Field from the Jobs collection to match
          as: 'userDetails', // Name of the output array field
        },
      },

      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
    ]).exec();

    console.log('result for Admin', result);
    return result;
  }

  async findJobDetails(jobId: string): Promise<Apply[]> {
    // return this.ApplyModel.find({ jobId })
    //   .populate('userId', 'firstName lastName username')
    //   .exec();
    return this.findAppliedJobs(null, null, null, null, jobId);
  }

  async updateAlltheApplications(jobId: Types.ObjectId, appId: string) {
    try {
      const updateQuery = {
        jobId,
        _id: { $ne: new Types.ObjectId(appId) },
      };
      const result = await this.ApplyModel.updateMany(updateQuery, {
        status: APPLY_STATUSES.notAwarded,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async rewardApplication(
    id: string,
    jobId: string,
    comment: string,
  ): Promise<Apply> {
    // console.log(`Rewarding application with ID: ${id}`);

    const application = await this.ApplyModel.findById(id).exec();

    const validStatusesForAward = [
      APPLY_STATUSES.approvedPendingForProposalForInnovators,
      APPLY_STATUSES.proposalUnderReview,
    ];
    console.log('application', application);
    if (
      !application?._id ||
      !validStatusesForAward.includes(application.status)
    ) {
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
    console.log('application', application);
    this.updateAlltheApplications(application.jobId, id);
    // console.log(`Application with ID: ${id} awarded.`);
    const proposals = await this.proposalModel
      .find({
        projectId: application.jobId,
      })
      .exec();

    let awardedProposalFound = false;

    for (const proposal of proposals) {
      if (proposal.applyId.toString() === application._id.toString()) {
        proposal.Status = PROPOSAL_STATUSES.approvedAndAwarded;
        await proposal.save();
        awardedProposalFound = true;
      } else {
        proposal.Status = PROPOSAL_STATUSES.notAwarded;
        await proposal.save();
      }
    }

    // Ensure that one proposal is awarded
    if (!awardedProposalFound) {
      throw new Error('No matching proposal found to award.');
    }

    // Get all other applications and set their status to 'Not Awarded'
    const otherApplications = await this.ApplyModel.find({
      _id: { $ne: id },
      jobId: application.jobId,
      status: { $in: ['Approved', 'Awarded'] },
    }).exec();

    const updatedApplications = otherApplications.map((app) => ({
      _id: app._id as Types.ObjectId,
      status: 'Not Awarded',
      jobId: app.jobId as Types.ObjectId,
      comment_Reward_Nonreward:
        'Thank you for your application. Although we cannot award this application, we value your interest and encourage you to apply for other roles or opportunities with us in the future.', // Default comment
      userId: app.userId as Types.ObjectId,
      username: app.username.toString(),
    }));
    console.log('updatedApplications', updatedApplications);
    // console.log('Applications to be updated:', updatedApplications);

    await this.updateStatuses({ applications: updatedApplications });
    // Send notification emails
    const user = await this.userModel.findById(application.userId).exec();
    if (user) {
      this.emailService.sendAwardedEmail({
        to: user.username,
        applicationTitle: application.title,
      });
    }

    for (const app of updatedApplications) {
      const otherUser = await this.userModel.findById(app.userId).exec();
      if (otherUser) {
        this.emailService.sendNotAwardedEmail({
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
