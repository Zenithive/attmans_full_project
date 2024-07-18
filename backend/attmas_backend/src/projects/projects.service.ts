import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument } from 'src/users/user.schema';
import { Jobs, JobsDocument } from './projects.schema';
import { CreateJobsDto, UpdateJobsDto } from './create-projects.dto';
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
    const title = savedJob.title;

    for (const admin of adminUsers) {
      await this.emailService.sendEmailProject(
        admin.username,
        subject,
        jobId,
        title,
      );
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

    if (Expertiselevel && Expertiselevel.length > 0) {
      filter.Expertiselevel = { $in: Expertiselevel };
    }

    console.log('Applied Filters:', filter);

    return this.jobsModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
  }

  async findJobWithUser(id: string): Promise<Jobs> {
    return this.jobsModel.findById(id).populate('user').exec();
  }

  async update(id: string, updateJobsDto: UpdateJobsDto): Promise<Jobs> {
    const existingJob = await this.jobsModel.findById({ _id: id });
    if (!existingJob) {
      throw new NotFoundException(`Jobs with id ${id} not found`);
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
    const Project = await this.jobsModel.findById(id);
    if (!Project) {
      throw new NotFoundException('Job not found');
    }
    Project.status = 'Approved';
    Project.buttonsHidden = true;
    await Project.save();

    const exhibitionId = new Types.ObjectId(Project.exhibitionId);

    const exhibition: any = await this.exhibitionModel
      .findById(exhibitionId)
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
    if (exhibition) {
      const projectOwner = await this.userModel.findById(Project.userId);
      console.log('project OWner', projectOwner);
      if (projectOwner) {
        console.log('project OWner', projectOwner);
        await this.emailService.sendProjectStatusEmail(
          projectOwner.username,
          'Project Approved',
          (exhibition._id as Types.ObjectId).toHexString(),
          Project.title,
          'Approved',
          Project.username,
          exhibition.userId.firstName,
          exhibition.userId.lastName,
        );
      }
    }
    return Project;
  }

  async rejectProject(id: string): Promise<Jobs> {
    const Project = await this.jobsModel.findById(id);
    if (!Project) {
      throw new NotFoundException('Job not found');
    }
    Project.status = 'Rejected';
    Project.buttonsHidden = true;
    await Project.save();
    const exhibitionId = new Types.ObjectId(Project.exhibitionId);

    const exhibition: any = await this.exhibitionModel
      .findById(exhibitionId)
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
    if (exhibition) {
      const projectOwner = await this.userModel.findById(Project.userId);
      console.log('project OWner', projectOwner);
      if (projectOwner) {
        await this.emailService.sendProjectStatusEmail(
          projectOwner.username,
          'Project Rejected',
          (exhibition._id as Types.ObjectId).toHexString(),
          Project.title,
          'Rejected',
          Project.username,
          exhibition.userId.firstName,
          exhibition.userId.lastName,
        );
      }
    }
    return Project;
  }
}
