import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as nodemailer from 'nodemailer';
import { Model, Types } from 'mongoose';
import { Apply, ApplyDocument } from 'src/apply/apply.schema';
import { Jobs, JobsDocument } from 'src/projects/projects.schema';
import { User, UserDocument } from 'src/users/user.schema';
import { CreateMilestoneDto } from './create-milestone.dto';
import { Milestone, MilestoneDocument } from './milestone.schema';
import { UsersService } from 'src/users/users.service';
import { Email } from 'src/notificationEmail/Exebitionemail.schema';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectModel(Milestone.name)
    private readonly milestoneModel: Model<MilestoneDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Jobs.name) private readonly jobsModel: Model<JobsDocument>,
    @InjectModel(Email.name)
    private emailModel: Model<Email>,
    private usersService: UsersService,
    @InjectModel(Apply.name)
    private readonly appliesModel: Model<ApplyDocument>,
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

  async create(createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    const {
      scopeOfWork,
      milestones,
      userId,
      applyId,
      jobId,
      milstonSubmitcomments,
    } = createMilestoneDto;

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const job = await this.jobsModel.findById(jobId);
    if (!job) throw new NotFoundException(`Job with id ${jobId} not found`);

    const apply = await this.appliesModel.findById(applyId);
    if (!apply)
      throw new NotFoundException(`Application with id ${applyId} not found`);

    const milestone = new this.milestoneModel({
      scopeOfWork,
      milestones,
      userId,
      jobId,
      applyId,
      milstonSubmitcomments: milstonSubmitcomments || [],
    });

    return milestone.save();
  }

  async submitComment(
    applyId: string,
    milestoneIndex: number,
    comment: string,
  ): Promise<void> {
    const milestone = await this.milestoneModel.findOne({ applyId });
    if (!milestone) {
      throw new NotFoundException(`Milestone not found for applyId ${applyId}`);
    }

    // Ensure the milestone exists before updating
    if (milestone.milestones[milestoneIndex]) {
      milestone.milestones[milestoneIndex].isCommentSubmitted = true;
      milestone.milestones[milestoneIndex].status = 'Submitted';
      milestone.milestones[milestoneIndex].submittedAt = new Date(); // Set the submission date
    }

    // Update comments array if needed
    milestone.milstonSubmitcomments[milestoneIndex] = comment;

    this.sendMilestonesubmitNotifications(milestone, milestoneIndex);

    await milestone.save();
  }

  async sendMilestonesubmitNotifications(milestone, milestoneIndex) {
    const user = await this.userModel.findOne({ _id: milestone.userId }).exec();

    const adminUsers = await this.usersService.findUsersByUserType1('Admin');
    if (!adminUsers || adminUsers.length === 0) {
      throw new NotFoundException('No Admin users found');
    }

    const title = milestone.milestones[milestoneIndex].name.text;
    const adminStatus = milestone.milestones[milestoneIndex].adminStatus;
    for (const admin of adminUsers) {
      const message = `
      Dear ${admin.firstName} ${admin.lastName},<br>
      Your Milestone "${title}" has been submitted by ${user.firstName} ${user.lastName}.
    `;
      this.sendEmailNotificationToUserMilestoneActivity({
        user: admin,
        subject: 'Milestone submitted',
        adminFirstName: admin.firstName,
        adminLastName: admin.lastName,
        applicationId: milestone.applyId,
        message,
        status: 'Submitted',
        title,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        adminStatus,
        projectId: milestone.jobId,
      });
    }
  }

  async getSubmittedComments(applyId: string): Promise<string[]> {
    const milestone = await this.milestoneModel.findOne({ applyId });
    if (!milestone) {
      throw new NotFoundException(`Milestone not found for applyId ${applyId}`);
    }

    return milestone.milstonSubmitcomments;
  }

  async getMilestonesByApplyId(applyId: string): Promise<Milestone[]> {
    const milestones = await this.milestoneModel.find({ applyId }).exec();
    if (!milestones || milestones.length === 0) {
      throw new NotFoundException(`No milestones found for applyId ${applyId}`);
    }
    return milestones;
  }

  async findSubmittedMilestones(applyId: string): Promise<any[]> {
    const submittedMilestones = await this.milestoneModel
      .aggregate([
        { $match: { applyId } },
        { $unwind: '$milestones' },
        { $match: { 'milestones.adminStatus': 'Project Owner Approved' } },
        {
          $project: {
            _id: 0,
            'milestones._id': 1,
            'milestones.name': 1,
            'milestones.status': 1,
            'milestones.submittedAt': 1,
            'milestones.adminStatus': 1,
            'milestones.adminComments': 1,
          },
        },
      ])
      .exec();

    const allSubmittedMilestones = submittedMilestones.map(
      (doc) => doc.milestones,
    );

    return allSubmittedMilestones;
  }

  async approveMilestone(
    applyId: string,
    milestoneIndex: number,
    comment: string,
    userId: string,
  ): Promise<void> {
    const milestone = await this.milestoneModel.findOne({ applyId });
    if (!milestone) {
      throw new NotFoundException(`Milestone not found for applyId ${applyId}`);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const { userType } = user;

    const selectedMilestone = milestone.milestones[milestoneIndex];
    if (!selectedMilestone) {
      throw new BadRequestException(
        `Milestone index ${milestoneIndex} is out of bounds`,
      );
    }

    if (selectedMilestone.adminStatus === 'Admin Rejected') {
      throw new BadRequestException(
        'This milestone was rejected by the admin and cannot be approved.',
      );
    }

    if (userType === 'Admin') {
      selectedMilestone.adminStatus = 'Admin Approved';
      //selectedMilestone.approvalComments.push(comment);
      selectedMilestone.comments.push({
        comment,
        commentType: 'Approval Comment',
        userId: new Types.ObjectId(userId),
        userType,
      });

      const projectOwner = await this.jobsModel.findById(milestone.jobId);
      if (!projectOwner) {
        throw new NotFoundException(
          `Project owner not found for jobId ${milestone.jobId}`,
        );
      }
      this.sendApproveMilestoneByNotifications(
        milestone,
        milestoneIndex,
        user,
        projectOwner,
      );
    } else if (userType === 'Project Owner') {
      if (selectedMilestone.adminStatus !== 'Admin Approved') {
        throw new BadRequestException(
          'Admin has not approved this milestone yet.',
        );
      }
      selectedMilestone.adminStatus = 'Project Owner Approved';
      // selectedMilestone.approvalComments.push(comment);
      selectedMilestone.comments.push({
        comment,
        commentType: 'Approval Comment',
        userId: new Types.ObjectId(userId),
        userType,
      });
    }

    this.sendApproveMilestoneByNotifications(
      milestone,
      milestoneIndex,
      user,
      user,
    );

    await milestone.save();
  }

  async sendApproveMilestoneByNotifications(
    milestone,
    milestoneIndex,
    approvedByuser,
    projectOwner,
  ) {
    const user = await this.userModel.findOne({ _id: milestone.userId }).exec();

    const adminUsers = await this.usersService.findUsersByUserType1('Admin');
    if (!adminUsers || adminUsers.length === 0) {
      throw new NotFoundException('No Admin users found');
    }
    const title = milestone.milestones[milestoneIndex].name.text;
    const adminStatus = milestone.milestones[milestoneIndex].adminStatus;
    const message = `
      Dear ${user.firstName} ${user.lastName},<br>
      Your Milestone "${title}" has been approved by ${approvedByuser.firstName} ${approvedByuser.lastName}(${approvedByuser.userType}).
    `;
    const projectOwnerMessage = `
    Dear ${projectOwner.firstName} ${projectOwner.lastName},<br>
    The Milestone "${title}" has been approved.
  `;
    if (approvedByuser._id.toString() !== user._id.toString()) {
      this.sendEmailNotificationToUserMilestoneActivity({
        user,
        subject: 'Milestone Approved',
        adminFirstName: approvedByuser.firstName,
        adminLastName: approvedByuser.lastName,
        applicationId: milestone.applyId,
        message,
        status: 'Approved',
        title,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        adminStatus,
        projectId: milestone.jobId,
      });
    }
    if (approvedByuser._id.toString() !== projectOwner._id.toString()) {
      await this.sendEmailNotificationToUserMilestoneActivity({
        user: projectOwner,
        subject: 'Milestone Approved',
        adminFirstName: approvedByuser.firstName,
        adminLastName: approvedByuser.lastName,
        applicationId: milestone.applyId,
        message: projectOwnerMessage,
        status: 'Approved',
        title,
        userFirstName: projectOwner.firstName,
        userLastName: projectOwner.lastName,
        adminStatus,
        projectId: milestone.jobId,
      });
    }
  }

  async rejectMilestone(
    applyId: string,
    milestoneIndex: number,
    comment: string,
    userId: string,
  ): Promise<void> {
    const milestone = await this.milestoneModel.findOne({ applyId });
    if (!milestone) {
      throw new NotFoundException(`Milestone not found for applyId ${applyId}`);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const { userType } = user;

    const selectedMilestone = milestone.milestones[milestoneIndex];
    if (!selectedMilestone) {
      throw new BadRequestException(
        `Milestone index ${milestoneIndex} is out of bounds`,
      );
    }

    if (userType === 'Admin') {
      if (selectedMilestone.adminStatus === 'Admin Approved') {
        throw new BadRequestException(
          'This milestone was already approved by the admin and cannot be rejected.',
        );
      }

      selectedMilestone.adminStatus = 'Admin Rejected';
      //selectedMilestone.rejectionComments.push(comment);
      selectedMilestone.comments.push({
        comment,
        commentType: 'Rejection Comment',
        userId: new Types.ObjectId(userId),
        userType,
      });
    } else if (userType === 'Project Owner') {
      if (selectedMilestone.adminStatus !== 'Admin Approved') {
        throw new BadRequestException(
          'The admin has not approved this milestone yet.',
        );
      }

      selectedMilestone.adminStatus = 'Project Owner Rejected';
      // selectedMilestone.rejectionComments.push(comment);
      selectedMilestone.comments.push({
        comment,
        commentType: 'Rejection Comment',
        userId: new Types.ObjectId(userId),
        userType,
      });
    }

    this.sendRejectMilestoneByNotifications(milestone, milestoneIndex, user);

    await milestone.save();
  }

  async sendRejectMilestoneByNotifications(
    milestone,
    milestoneIndex,
    rejectedByuser,
  ) {
    const user = await this.userModel.findOne({ _id: milestone.userId }).exec();

    const title = milestone.milestones[milestoneIndex].name.text;
    const adminStatus = milestone.milestones[milestoneIndex].adminStatus;
    const message = `
      Dear ${user.firstName} ${user.lastName},<br>
      Your Milestone "${title}" has been rejected by ${rejectedByuser.firstName} ${rejectedByuser.lastName}(${rejectedByuser.userType}).
    `;
    this.sendEmailNotificationToUserMilestoneActivity({
      user,
      subject: 'Milestone Rejected',
      adminFirstName: rejectedByuser.firstName,
      adminLastName: rejectedByuser.lastName,
      applicationId: milestone.applyId,
      message,
      status: 'Rejected',
      title,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      adminStatus,
      projectId: milestone.jobId,
    });
  }

  async resubmitMilestone(
    applyId: string,
    milestoneIndex: number,
    comment: string,
  ): Promise<void> {
    const milestone = await this.milestoneModel.findOne({ applyId });
    const application = await this.appliesModel.findOne({ _id: applyId });
    const user = await this.userModel.findOne({ _id: milestone.userId }).exec();
    if (!milestone) {
      throw new NotFoundException(`Milestone not found for applyId ${applyId}`);
    }

    if (!application) {
      throw new NotFoundException(
        `Application not found for applyId ${applyId}`,
      );
    }

    if (milestone.milestones[milestoneIndex]) {
      milestone.milestones[milestoneIndex].adminStatus = 'Pending';
      // milestone.milestones[milestoneIndex].projectOwnerStatus = 'Pending';
      //milestone.milestones[milestoneIndex].resubmissionComments.push(comment);
      milestone.milestones[milestoneIndex].comments.push({
        comment,
        commentType: 'Resubmission Comment',
        userId: new Types.ObjectId(milestone.userId),
        userType: user.userType,
      });
    } else {
      throw new BadRequestException(
        `Milestone index ${milestoneIndex} is out of bounds`,
      );
    }

    this.sendMilestoneResubmitNotifications(milestone, milestoneIndex);

    await milestone.save();
  }

  async sendMilestoneResubmitNotifications(milestone, milestoneIndex) {
    const user = await this.userModel.findOne({ _id: milestone.userId }).exec();

    const adminUsers = await this.usersService.findUsersByUserType1('Admin');
    if (!adminUsers || adminUsers.length === 0) {
      throw new NotFoundException('No Admin users found');
    }

    const title = milestone.milestones[milestoneIndex].name.text;
    const adminStatus = milestone.milestones[milestoneIndex].adminStatus;
    for (const admin of adminUsers) {
      const message = `
      Dear ${admin.firstName} ${admin.lastName},<br>
      Your Milestone "${title}" has been Resubmitted by ${user.firstName} ${user.lastName}.
    `;
      this.sendEmailNotificationToUserMilestoneActivity({
        user: admin,
        subject: 'Milestone resubmitted',
        adminFirstName: admin.firstName,
        adminLastName: admin.lastName,
        applicationId: milestone.applyId,
        message,
        status: 'Resubmitted',
        title,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        adminStatus,
        projectId: milestone.jobId,
      });
    }
  }

  async sendEmailNotificationToUserMilestoneActivity({
    user,
    subject,
    applicationId,
    title,
    status,
    message,
    adminFirstName,
    adminLastName,
    userFirstName,
    userLastName,
    adminStatus,
    projectId,
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
        first: userFirstName,
        last: userLastName,
        adminStatus,
        status,
        adminFirstName,
        adminLastName,
        projectId,
      });
      await email.save();
    } catch (error) {
      console.error(`Error sending email to ${user.username}:`, error);
    }
  }
}
