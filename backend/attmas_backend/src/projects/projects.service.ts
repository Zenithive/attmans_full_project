// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

// import { User, UserDocument } from 'src/users/user.schema';
// import { Jobs, JobsDocument } from './projects.schema';
// import { CreateJobsDto, UpdateJobsDto } from './create-projects.dto';

// @Injectable()
// export class JobsService {
//   [x: string]: any;
//   constructor(
//     @InjectModel(Jobs.name)
//     private jobsModel: Model<JobsDocument>,
//     @InjectModel(User.name) private userModel: Model<UserDocument>,
//   ) {}

//   async create(createJobsDto: CreateJobsDto): Promise<Jobs> {
//     const createdJobs = new this.jobsModel(createJobsDto);
//     return createdJobs.save();
//   }

//   async findAll(
//     page: number,
//     limit: number,
//     Category: string[],
//     userId?: string,
//     Subcategorys?: string[],
//     Expertiselevel?: string[],
//   ): Promise<Jobs[]> {
//     const skip = (page - 1) * limit;
//     const filter: any = {};

//     if (userId) {
//       filter.userId = userId;
//     }

//     if (Category && Category.length > 0) {
//       filter.Category = { $in: Category };
//     }

//     if (Subcategorys && Subcategorys.length > 0) {
//       filter.Subcategorys = { $in: Subcategorys };
//     }

//     if (Expertiselevel && Expertiselevel.length > 0) {
//       filter.Expertiselevel = { $in: Expertiselevel };
//     }

//     console.log('Applied Filters:', filter);

//     return this.jobsModel
//       .find(filter)
//       .skip(skip)
//       .limit(limit)
//       .populate('userId', 'firstName lastName username', this.userModel)
//       .exec();
//   }

//   async findJobWithUser(id: string): Promise<Jobs> {
//     return this.jobsModel.findById(id).populate('user').exec();
//   }

//   async update(id: string, updateJobsDto: UpdateJobsDto): Promise<Jobs> {
//     const existingJob = await this.jobsModel.findById({ _id: id });
//     console.log('update existingJobs', existingJob);
//     if (!existingJob) {
//       throw new NotFoundException(`Jobs with id ${id} not found`);
//     }
//     Object.assign(existingJob, updateJobsDto);
//     return existingJob.save();
//   }

//   async delete(id: string): Promise<Jobs> {
//     const existingJobDelete = await this.jobsModel.findByIdAndDelete({
//       _id: id,
//     });
//     console.log('deleye existingJobs', existingJobDelete);
//     if (!existingJobDelete) {
//       throw new NotFoundException(`Job with id ${id} not found`);
//     }
//     return existingJobDelete;
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/users/user.schema';
import { Jobs, JobsDocument } from './projects.schema';
import { CreateJobsDto, UpdateJobsDto } from './create-projects.dto';
import { UsersService } from 'src/users/users.service';
import { EmailService2 } from 'src/notificationEmail/Exebitionemail.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs.name)
    private jobsModel: Model<JobsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private readonly emailService: EmailService2,
  ) {}

  async create(createJobsDto: CreateJobsDto): Promise<Jobs> {
    const createdJobs = new this.jobsModel(createJobsDto);
    const savedJob = await createdJobs.save();

    // Send email to Admin
    const adminUsers = await this.usersService.findUsersByUserType1('Admin'); // Adjust this method as needed
    const subject = 'New Project Created';
    const jobId = savedJob._id.toString();
    const first = savedJob.firstName;
    const last = savedJob.lastName;
    const title = savedJob.title;

    for (const admin of adminUsers) {
      await this.emailService.sendEmailProject(admin.username, subject, jobId, title, first, last);
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
    console.log('update existingJobs', existingJob);
    if (!existingJob) {
      throw new NotFoundException(`Jobs with id ${id} not found`);
    }
    Object.assign(existingJob, updateJobsDto);
    return existingJob.save();
  }

  async delete(id: string): Promise<Jobs> {
    const existingJobDelete = await this.jobsModel.findByIdAndDelete({ _id: id });
    console.log('delete existingJobs', existingJobDelete);
    if (!existingJobDelete) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return existingJobDelete;
  }
}
