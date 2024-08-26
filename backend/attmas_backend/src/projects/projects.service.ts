import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument } from 'src/users/user.schema';
import { Jobs, JobsDocument } from './projects.schema';
import {
  AddCommentDto,
  CreateJobsDto,
  UpdateJobsDto,
} from './create-projects.dto';
import { UsersService } from 'src/users/users.service';
import { EmailService2 } from 'src/notificationEmail/Exebitionemail.service';
import {
  Exhibition,
  ExhibitionDocument,
} from 'src/exhibition/schema/exhibition.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs.name)
    private jobsModel: Model<JobsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private readonly emailService: EmailService2,
    @InjectModel(Exhibition.name)
    private exhibitionModel: Model<ExhibitionDocument>,
  ) {}

  async create(createJobsDto: CreateJobsDto): Promise<Jobs> {
    const createdJobs = new this.jobsModel(createJobsDto);
    const savedJob = await createdJobs.save();

    // Send email to Admin
    const adminUsers = await this.usersService.findUsersByUserType1('Admin');
    const subject = 'New Project Created';
    const jobId = savedJob._id.toString();
    const first = savedJob.firstName;
    const last = savedJob.lastName;
    const title = savedJob.title;

    for (const admin of adminUsers) {
      await this.emailService.sendEmailProject(
        admin.username,
        subject,
        jobId,
        title,
        first,
        last,
      );
      // await this.emailService.sendEmailProject(
      //   admin.username,
      //   subject,
      //   jobId,
      //   title,
      // );
    }

    return savedJob;
  }

  async findAll(
    page: number,
    limit: number,
    Category: string[],
    userId?: string,
    Subcategorys?: string[],
    Expertiselevel?: string[],
    status?: string,
    SelectService?: string[],
  ): Promise<Jobs[]> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (userId) {
      filter.userId = userId;
    }

    if (Category && Category.length > 0) {
      filter.Category = { $in: Category };
    }

    if (Subcategorys && Subcategorys.length > 0) {
      filter.Subcategorys = { $in: Subcategorys };
    }
    console.log('Subcategorys', Subcategorys);

    if (Expertiselevel && Expertiselevel.length > 0) {
      filter.Expertiselevel = { $in: Expertiselevel };
    }

    if (status) {
      filter.status = status;
    }

    if (SelectService && SelectService.length > 0) {
      filter.SelectService = { $in: SelectService };
    }
    console.log('SelectService', SelectService);

    // console.log('Applied Filters:', filter);

    return this.jobsModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .populate(
        'userId',
        'firstName lastName username userType',
        this.userModel,
      )
      .exec();
  }

  async findJobWithUser(id: string): Promise<Jobs> {
    return this.jobsModel
      .findById(id)
      .populate('userId', 'firstName lastName username')
      .exec();
  }

  async update(id: string, updateJobsDto: UpdateJobsDto): Promise<Jobs> {
    console.log('id', id);

    const existingJob = await this.jobsModel.findById({ _id: id }).exec();
    console.log('existingJob', existingJob);

    if (!existingJob) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    Object.assign(existingJob, updateJobsDto);

    return existingJob.save();
  }

  async delete(id: string): Promise<Jobs> {
    const existingJobDelete = await this.jobsModel.findByIdAndDelete({
      _id: id,
    });
    if (!existingJobDelete) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return existingJobDelete;
  }

  async approveProject(id: string): Promise<Jobs> {
    try {
      console.log(`Approving project with ID: ${id}`);
      const project = await this.jobsModel.findById(id);
      if (!project) {
        throw new NotFoundException('Job not found');
      }
      project.status = 'Approved';
      project.buttonsHidden = true;
      await project.save();

      const adminUsers = await this.usersService.findUsersByUserType1('Admin');
      if (!adminUsers || adminUsers.length === 0) {
        throw new NotFoundException('No Admin users found');
      }

      const jobId = project._id.toString();
      const title = project.title;
      console.log('title of Project', title);

      for (const admin of adminUsers) {
        if (project) {
          console.log('project', project);
          await this.emailService.sendProjectStatusEmail(
            project.username,
            'Project Approved',
            jobId,
            title,
            'approved',
            admin.firstName,
            admin.lastName,
          );
        }
      }
      return project;
    } catch (error) {
      console.error(`Error approving project with ID ${id}:`, error);
      throw error;
    }
  }

  async rejectProject(id: string, comment: string): Promise<Jobs> {
    try {
      console.log(`Rejecting project with ID: ${id}`);
      const project = await this.jobsModel.findById(id);
      if (!project) {
        throw new NotFoundException('Job not found');
      }
      project.status = 'Rejected';
      project.buttonsHidden = true;
      project.rejectComment = comment;
      await project.save();

      const adminUsers = await this.usersService.findUsersByUserType1('Admin');
      if (!adminUsers || adminUsers.length === 0) {
        throw new NotFoundException('No Admin users found');
      }

      console.log('adminUsers', adminUsers);

      // const userId = project.userId as Types.ObjectId;
      // console.log('userId', userId);

      const jobId = project._id.toString();
      const title = project.title;

      for (const admin of adminUsers) {
        if (project) {
          console.log('project', project);
          await this.emailService.sendProjectStatusEmail(
            project.username,
            'Project Rejected',
            jobId,
            title,
            'rejected',
            admin.firstName,
            admin.lastName,
          );
        }
      }
      return project;
    } catch (error) {
      console.error(`Error rejecting project with ID ${id}:`, error);
      throw error;
    }
  }

  async addComment(jobId: string, addCommentDto: AddCommentDto): Promise<Jobs> {
    const job = await this.jobsModel.findById(jobId);
    if (!job) {
      throw new NotFoundException(`Job with id ${jobId} not found`);
    }

    const user = await this.userModel.findById(addCommentDto.createdBy);
    if (!user) {
      throw new NotFoundException(
        `User with id ${addCommentDto.createdBy} not found`,
      );
    }

    const comment = {
      commentText: addCommentDto.commentText,
      createdBy: new Types.ObjectId(addCommentDto.createdBy),
      createdAt: new Date(),
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
    };

    job.comments.push(comment);
    return job.save();
  }

  async updateStatusAndComment(
    id: string,
    status: string,
    comment: string,
  ): Promise<Jobs> {
    // Find the job by ID
    const job = await this.jobsModel.findById(id);
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    // Update the status and comment fields
    job.status = status;
    job.commentWhenProjectClose = comment;

    // Save the updated job back to the database
    return job.save();
  }

  async updateStatusAndCommentByAdmin(
    id: string,
    status: string,
    comment: string,
  ): Promise<Jobs> {
    console.log(`Admin updating job with ID: ${id}`);
    console.log(`Status: ${status}`);
    console.log(`Comment: ${comment}`);

    // Find the job by ID
    const job = await this.jobsModel.findById(id);
    if (!job) {
      console.log(`Job with ID ${id} not found`);
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    // Update the status and comment fields
    job.status = status;
    job.commentWhenProjectCloseByAdmin = comment;

    // Save the updated job back to the database
    const updatedJob = await job.save();
    console.log('Job updated successfully by admin:', updatedJob);

    return updatedJob;
  }
}
