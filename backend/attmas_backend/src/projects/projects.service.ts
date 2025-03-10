import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

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
import { getSameDateISOs } from 'src/services/util.services';

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
    for (const key in createJobsDto) {
      if (typeof createJobsDto[key] === 'string') {
        createJobsDto[key] = createJobsDto[key].trim();
      }
    }

    if (
      createJobsDto.SelectService &&
      createJobsDto.SelectService.includes('Innovative Product')
    ) {
      createJobsDto.Expertiselevel = undefined;
    }

    if (createJobsDto.userId) {
      createJobsDto.userId = new Types.ObjectId(createJobsDto.userId);
    }

    const createdJobs = new this.jobsModel(createJobsDto);
    const savedJob = await createdJobs.save();

    this.sendEmailToAdminAfterProjectCreate(savedJob);

    return savedJob;
  }

  async sendEmailToAdminAfterProjectCreate(savedJob) {
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
    }
  }

  // async filterJobs(
  //   page: number,
  //   limit: number,
  //   Category: string[],
  //   userId?: string,
  //   Subcategorys?: string[],
  //   Expertiselevel?: string[],
  //   status?: string,
  //   SelectService?: string[],
  //   title?: string,
  //   createdAt?: string,
  //   TimeFrame?: string,
  //   ProjectOwner?: string,
  // ): Promise<Jobs[]> {
  //   const skip = (page - 1) * limit;
  //   const filter: any = {};
  //   const filterQuery: any = {};

  //   const allNativeFiltersArray = {
  //     title,
  //     status,
  //     SelectService,
  //     Subcategorys,
  //     Category,
  //     createdAt,
  //     TimeFrame,
  //   };

  //   for (const key in allNativeFiltersArray) {
  //     if (Object.prototype.hasOwnProperty.call(allNativeFiltersArray, key)) {
  //       const element = allNativeFiltersArray[key];
  //       if ((key === 'createdAt' || key === 'TimeFrame') && element) {
  //         const sameDateISOs = getSameDateISOs(element);
  //         filterQuery[key] = {
  //           $gte: sameDateISOs.startOfDay,
  //           $lte: sameDateISOs.endOfDay,
  //         };
  //       } else if (element) {
  //         filterQuery[key] = new RegExp(element, 'i');
  //       }
  //     }
  //   }

  //   if (ProjectOwner) {
  //     filter.ProjectOwner = new RegExp(ProjectOwner, 'i');
  //   }

  //   if (Category && Category.length > 0) {
  //     filter.Category = { $in: Category };
  //   }

  //   if (Subcategorys && Subcategorys.length > 0) {
  //     filter.Subcategorys = { $in: Subcategorys };
  //   }

  //   if (Expertiselevel && Expertiselevel.length > 0) {
  //     filter.Expertiselevel = { $in: Expertiselevel };
  //   }

  //   if (status) {
  //     filter.status = status;
  //   }

  //   if (SelectService && SelectService.length > 0) {
  //     filter.SelectService = { $in: SelectService };
  //   }

  //   const pipeline: PipelineStage[] = [
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'userId',
  //         foreignField: '_id',
  //         as: 'userId',
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$userId',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $match: {
  //         ...filterQuery,
  //         ...(userId && {
  //           'userId._id': new Types.ObjectId(userId),
  //         }),
  //         ...(filter.ProjectOwner && {
  //           $or: [
  //             { 'userId.firstName': filter.ProjectOwner },
  //             { 'userId.lastName': filter.ProjectOwner },
  //           ],
  //         }),
  //       },
  //     },
  //     { $sort: { createdAt: -1 } },
  //     { $skip: skip },
  //     { $limit: limit },
  //     {
  //       $project: {
  //         _id: 1,
  //         Quantity: 1,
  //         Budget: 1,
  //         Category: 1,
  //         DetailsOfInnovationChallenge: 1,
  //         Expectedoutcomes: 1,
  //         Expertiselevel: 1,
  //         IPRownership: 1,
  //         Objective: 1,
  //         ProductDescription: 1,
  //         Sector: 1,
  //         SelectService: 1,
  //         Subcategorys: 1,
  //         TimeFrame: 1,
  //         title: 1,
  //         currency: 1,
  //         description: 1,
  //         createdAt: 1,
  //         status: 1,
  //         userId: { _id: 1, firstName: 1, lastName: 1, username: 1 },
  //       },
  //     },
  //   ];

  //   return await this.jobsModel.aggregate(pipeline);
  // }

  async filterJobs(
    page: number,
    limit: number,
    Category: string[],
    userId?: string,
    projId?: string,
    appUserId?: string,
    Subcategorys?: string[],
    Expertiselevel?: string[],
    status?: string,
    SelectService?: string[],
    title?: string,
    createdAt?: string,
    TimeFrame?: string,
    ProjectOwner?: string,
    appstatus?: string, // Application status (e.g., 'Awarded')
    applicationId?: string,
  ): Promise<Jobs[]> {
    const skip = (page - 1) * limit;
    const filter: any = {};
    const filterQuery: any = {};

    const allNativeFiltersArray = {
      title,
      status,
      SelectService,
      Subcategorys,
      Category,
      createdAt,
      TimeFrame,
    };

    for (const key in allNativeFiltersArray) {
      if (Object.prototype.hasOwnProperty.call(allNativeFiltersArray, key)) {
        const element = allNativeFiltersArray[key];
        const elementValue = Array.isArray(element) ? element.length : element;
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

    if (ProjectOwner) {
      filter.ProjectOwner = new RegExp(ProjectOwner, 'i');
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

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'applies',
          localField: '_id',
          foreignField: 'jobId',
          as: 'applies',
        },
      },
      {
        $addFields: {
          appliesCount: { $size: '$applies' }, // Add the count of applies
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      {
        $unwind: {
          path: '$userId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          ...filterQuery,
          // ...(status && { status }), // Match job status dynamically
          ...(appstatus && { 'applies.status': new RegExp(appstatus, 'i') }), // Ensure at least one apply with the desired appstatus
          ...(appUserId && { 'applies.userId': new Types.ObjectId(appUserId) }),

          ...(userId && {
            'userId._id': new Types.ObjectId(userId),
          }),
          ...(projId && {
            _id: new Types.ObjectId(projId),
          }),
          ...(filter.ProjectOwner && {
            $or: [
              { 'userId.firstName': filter.ProjectOwner },
              { 'userId.lastName': filter.ProjectOwner },
            ],
          }),
          ...(applicationId && {
            'applies._id': new Types.ObjectId(applicationId),
          }),
        },
      },
      {
        $addFields: {
          awardedApplies: {
            $filter: {
              input: '$applies',
              as: 'apply',
              cond: {
                $and: [
                  appstatus ? { $eq: ['$$apply.status', appstatus] } : {}, // Match applies status dynamically
                ],
              },
            },
          },
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          Quantity: 1,
          Budget: 1,
          Category: 1,
          DetailsOfInnovationChallenge: 1,
          Expectedoutcomes: 1,
          Expertiselevel: 1,
          IPRownership: 1,
          Objective: 1,
          ProductDescription: 1,
          Sector: 1,
          SelectService: 1,
          Subcategorys: 1,
          TimeFrame: 1,
          title: 1,
          currency: 1,
          description: 1,
          createdAt: 1,
          status: 1,
          userId: { _id: 1, firstName: 1, lastName: 1, username: 1 },
          appliesCount: 1, // Include appliesCount in the projection,
          applies: { _id: 1, status: 1, userId: 1 },
          awardedApplies: 1, // Include awarded applies in the projection
        },
      },
    ];

    const data = await this.jobsModel.aggregate(pipeline);
    return data;
  }

  async findJobWithUser(id: string): Promise<Jobs> {
    return this.jobsModel
      .findById(id)
      .populate('userId', 'firstName lastName username')
      .exec();
  }

  async update(id: string, updateJobsDto: UpdateJobsDto): Promise<Jobs> {
    const existingJob = await this.jobsModel.findById({ _id: id }).exec();

    if (!existingJob) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    if (
      updateJobsDto.SelectService &&
      updateJobsDto.SelectService.includes('Innovative product')
    ) {
      // Ensure Expertiselevel is not set for 'Innovative product'
      updateJobsDto.Expertiselevel = undefined;
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
      const project = await this.jobsModel.findById(id);
      if (!project) {
        throw new NotFoundException('Job not found');
      }
      project.status = 'Approved';
      project.buttonsHidden = true;
      await project.save();

      if (
        project.SelectService.includes('Outsource Research and Development')
      ) {
        const freelancers =
          await this.usersService.findUsersByUserType1('Freelancer');
        if (freelancers.length === 0) {
        }
        for (const freelancer of freelancers) {
          this.emailService.sendEmailToFreelancer(
            freelancer.username,
            project._id.toString(),
            project.title,
            freelancer.userType,
          );
        }
      } else if (project.SelectService.includes('Innovative product')) {
        const innovators =
          await this.usersService.findUsersByUserType1('Innovator');
        if (innovators.length === 0) {
        }
        for (const innovator of innovators) {
          this.emailService.sendEmailToInnovator(
            innovator.username,
            project._id.toString(),
            project.title,
            innovator.userType,
          );
        }
      }

      this.sendEmailToProjectOwnerAfterProjectApprove(project);

      return project;
    } catch (error) {
      console.error(`Error approving project with ID ${id}:`, error);
      throw error;
    }
  }

  async sendEmailToProjectOwnerAfterProjectApprove(project) {
    const adminUsers = await this.usersService.findUsersByUserType1('Admin');
    if (!adminUsers || adminUsers.length === 0) {
      throw new NotFoundException('No Admin users found');
    }

    const jobId = project._id.toString();
    const title = project.title;

    for (const admin of adminUsers) {
      if (project) {
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
  }

  async rejectProject(id: string, comment: string): Promise<Jobs> {
    try {
      const project = await this.jobsModel.findById(id);
      if (!project) {
        throw new NotFoundException('Job not found');
      }
      project.status = 'Rejected';
      project.buttonsHidden = true;
      project.rejectComment = comment;
      await project.save();

      this.sendEmailToProjectOwnerAfterProjectReject(project);

      return project;
    } catch (error) {
      console.error(`Error rejecting project with ID ${id}:`, error);
      throw error;
    }
  }

  async sendEmailToProjectOwnerAfterProjectReject(project) {
    const adminUsers = await this.usersService.findUsersByUserType1('Admin');
    if (!adminUsers || adminUsers.length === 0) {
      throw new NotFoundException('No Admin users found');
    }

    const jobId = project._id.toString();
    const title = project.title;

    for (const admin of adminUsers) {
      if (project) {
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
    userId: string,
  ): Promise<Jobs> {
    // Find the job by ID
    const job = await this.jobsModel.findById(id);
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    console.log('userId', userId);
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
    // Find the job by ID
    const job = await this.jobsModel.findById(id);
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    // Update the status and comment fields
    job.status = status;
    job.commentWhenProjectCloseByAdmin = comment;

    // Save the updated job back to the database
    const updatedJob = await job.save();

    return updatedJob;
  }
}
