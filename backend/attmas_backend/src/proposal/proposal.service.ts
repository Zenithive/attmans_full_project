import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proposal } from './proposal.schema';
import * as nodemailer from 'nodemailer';
import {
  APPLY_STATUSES,
  PROPOSAL_STATUSES,
} from 'src/common/constant/status.constant';
import { Apply, ApplyDocument } from 'src/apply/apply.schema';
import { Email } from 'src/notificationEmail/Exebitionemail.schema';
import { User, UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { Jobs, JobsDocument } from 'src/projects/projects.schema';

interface ProposalFilter {
  projTitle: string;
  Category: string;
  Subcategorys: string;
  Status: string;
}

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel('Proposal') private readonly proposalModel: Model<Proposal>,
    @InjectModel(Email.name)
    private emailModel: Model<Email>,
    private usersService: UsersService,
    @InjectModel(Apply.name) private applyModel: Model<ApplyDocument>,
    @InjectModel(Jobs.name) private readonly jobsModel: Model<JobsDocument>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or any other service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private transporter: nodemailer.Transporter;

  async createProposal(createProposalDto: any): Promise<Proposal> {
    const existingProposalFromUser = await this.proposalModel
      .findOne({
        userId: createProposalDto.userId,
        applyId: createProposalDto.applyId,
      })
      .exec();
    if (existingProposalFromUser) {
      throw new Error('You have already created a proposal for this project.');
    }

    createProposalDto.Status = PROPOSAL_STATUSES.pending;

    const createdProposal = new this.proposalModel(createProposalDto);

    this.sendProposalSubmitNotifications(createdProposal);

    return createdProposal.save();
  }

  async sendProposalSubmitNotifications(proposal) {
    const user = await this.userModel
      .findOne({ _id: proposal.userID.toString() })
      .exec();

    const adminUsers = await this.usersService.findUsersByUserType1('Admin');
    if (!adminUsers || adminUsers.length === 0) {
      throw new NotFoundException('No Admin users found');
    }

    const title = proposal.projectTitle;
    for (const admin of adminUsers) {
      const message = `
      Dear ${admin.firstName} ${admin.lastName},<br>
      Your Proposal for project:"${title}" has been submitted by ${user.firstName} ${user.lastName}.
    `;
      this.sendEmailNotificationToUserProposalActivity({
        user: admin,
        subject: 'Proposal submitted',
        adminFirstName: admin.firstName,
        adminLastName: admin.lastName,
        applicationId: proposal.applyId,
        message,
        status: 'submitted',
        title,
      });
    }
  }

  async findAllProposal({
    projTitle,
    Category,
    Subcategorys,
    Status,
  }: ProposalFilter): Promise<Proposal[]> {
    try {
      const results = await this.proposalModel
        .aggregate([
          {
            $lookup: {
              from: 'jobs', // The collection to join with
              localField: 'projectTitle', // Field from proposals collection to match
              foreignField: 'title', // Field from jobs collection to match
              as: 'jobDetails', // Alias for the joined data
            },
          },
          {
            $unwind: {
              path: '$jobDetails', // Flatten the jobDetails array
              preserveNullAndEmptyArrays: true, // Keep proposals without matching jobs
            },
          },
          {
            $lookup: {
              from: 'applies',
              localField: 'applyId',
              foreignField: '_id',
              as: 'applyDetails',
            },
          },
          {
            $unwind: {
              path: '$applyDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'jobDetails.userId',
              foreignField: '_id',
              as: 'jobUserId',
            },
          },
          {
            $unwind: {
              path: '$jobUserId',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              ...(Status && {
                Status: new RegExp(Status, 'i'),
              }),
              ...(projTitle && {
                'jobDetails.title': new RegExp(projTitle, 'i'),
              }),
              ...(Category && {
                'jobDetails.Category': new RegExp(Category, 'i'),
              }),
              ...(Subcategorys && {
                'jobDetails.Subcategorys': new RegExp(Subcategorys, 'i'),
              }),
            },
          },
          {
            // Step 5: Add a field from 'vendorData' while keeping the other booth fields unchanged
            $addFields: {
              'jobDetails.userId.firstName': '$jobUserId.firstName', // Add/update only 'vendorName' in 'booths'
              'jobDetails.userId.lastName': '$jobUserId.lastName', // Add/update only 'vendorName' in 'booths'
              'jobDetails.userId._id': '$jobUserId._id', // Add/update only 'vendorName' in 'booths'
            },
          },
          { $limit: 100 },
          { $sort: { createdAt: -1 } },
          {
            $project: {
              jobDetails: 1, // Optionally exclude jobDetails if not needed
              // 'firstname': 1, // Include the added fields explicitly
              // 'lastname': 1,
              // Include all other fields from the proposals document explicitly
              applyDetails: { _id: 1, status: 1 },
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
              userID: 1,
              userName: 1,
              projectId: 1,
              applyId: 1,
              projectTitle: 1,
              firstname: 1,
              lastname: 1,
              Status: 1,
              comment: 1,
              // Include any other fields from your proposal schema
            },
          },
        ])
        .exec();

      return results;
    } catch (error) {
      console.error('Error during aggregation:', error);
      throw error;
    }
  }

  async findOneProposal(id: string): Promise<Proposal> {
    return this.proposalModel.findById(id).exec();
  }

  async updateProposal(id: string, updateProposalDto: any): Promise<Proposal> {
    return this.proposalModel
      .findByIdAndUpdate(id, updateProposalDto, { new: true })
      .exec();
  }

  async deleteProposal(id: string): Promise<any> {
    return this.proposalModel.findByIdAndDelete(id).exec();
  }

  async updateStatusProposal(
    id: string,
    status: 'Approved' | 'Rejected',
    comment: string,
    userId: string,
  ): Promise<Proposal> {
    const proposal = await this.proposalModel.findById(id).exec();
    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }
    if (
      proposal.Status === PROPOSAL_STATUSES.proposalUnderReview ||
      proposal.Status === PROPOSAL_STATUSES.rejected
    ) {
      throw new ConflictException(
        'Proposal has already been approved or rpejected',
      );
    }

    const newStatus =
      status === 'Approved'
        ? PROPOSAL_STATUSES.proposalUnderReview
        : PROPOSAL_STATUSES.rejected;

    const updatedProposal = await this.proposalModel
      .findByIdAndUpdate(
        id,
        { Status: newStatus, comment: comment },
        { new: true },
      )
      .exec();

    const statusMatchObj = {
      [PROPOSAL_STATUSES.pending]: APPLY_STATUSES.proposalApprovalPending,
      [PROPOSAL_STATUSES.proposalUnderReview]:
        APPLY_STATUSES.proposalUnderReview,
      [PROPOSAL_STATUSES.approvedAndAwarded]: APPLY_STATUSES.awarded,
      [PROPOSAL_STATUSES.rejected]: APPLY_STATUSES.rejected,
    };

    try {
      const result = await this.applyModel
        .updateOne(
          {
            _id: proposal.applyId,
          },
          { $set: { status: statusMatchObj[newStatus] } },
        )
        .exec();

      console.log('ApplyModel update result:', result);
    } catch (error) {
      console.error('Error updating ApplyModel:', error);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    this.sendProposalApproveRejecNotifications(updatedProposal, user);

    return updatedProposal;
  }

  async sendProposalApproveRejecNotifications(proposal, appUser) {
    const user = await this.userModel
      .findOne({ _id: proposal.userID.toString() })
      .exec();
    const projectOwner = await this.jobsModel
      .findOne({ _id: proposal.projectId.toString() })
      .exec();

    const title = proposal.projectTitle;
    const message = `
    Dear ${user.firstName} ${user.lastName},<br>
    Your Proposal for project:"${title}" has been ${proposal.Status} by ${appUser.firstName} ${appUser.lastName}(${appUser.userType}).
  `;
    this.sendEmailNotificationToUserProposalActivity({
      user,
      subject: `Proposal ${proposal.Status}`,
      adminFirstName: appUser.firstName,
      adminLastName: appUser.lastName,
      applicationId: proposal.applyId,
      message,
      status: proposal.Status,
      title,
    });
    console.log('projectOwner', projectOwner);

    if (projectOwner) {
      console.log('projectOwner', projectOwner);
      const ownerMessage = `
          Dear ${projectOwner.firstName} ${projectOwner.lastName},<br>
          The Proposal for your project: "${title}" has been ${proposal.Status} so you can Approve or Reject the proposal.
      `;

      await this.sendEmailNotificationToUserProposalActivity({
        user: projectOwner,
        subject: `Proposal ${proposal.Status}`,
        adminFirstName: appUser.firstName,
        adminLastName: appUser.lastName,
        applicationId: proposal.applyId,
        message: ownerMessage,
        status: proposal.Status,
        title,
      });
    }
  }

  async sendEmailNotificationToUserProposalActivity({
    user,
    subject,
    applicationId,
    title,
    status,
    message,
    adminFirstName,
    adminLastName,
  }) {
    try {
      const html = `${message}`;
      this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.username,
        subject,
        html,
      });

      const email = new this.emailModel({
        to: user.username,
        subject,
        sentAt: new Date(),
        read: false,
        applicationId,
        title,
        first: user.firstName,
        last: user.lastName,
        status,
        adminFirstName,
        adminLastName,
      });
      await email.save();
    } catch (error) {
      console.error(`Error sending email to ${user.username}:`, error);
    }
  }
}
