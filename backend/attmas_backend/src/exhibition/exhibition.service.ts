import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Exhibition, ExhibitionDocument } from './schema/exhibition.schema';
import {
  SendToInnovators,
  SendToInnovatorsDocument,
} from './schema/sendToInnovators.schema';
import {
  CreateExhibitionDto,
  UpdateExhibitionDto,
} from './dto/create-exhibition.dto';
import { SendToInnovatorsDto } from './dto/send-to-innovators.dto';
import { UsersService } from 'src/users/users.service';
import { EmailService2 } from 'src/notificationEmail/Exebitionemail.service';
import { getSameDateISOs } from 'src/services/util.services';

@Injectable()
export class ExhibitionService {
  [x: string]: any;
  constructor(
    @InjectModel(Exhibition.name)
    private exhibitionModel: Model<ExhibitionDocument>,
    @InjectModel(SendToInnovators.name)
    private sendToInnovatorsModel: Model<SendToInnovatorsDocument>,
    private usersService: UsersService,
    private readonly emailService: EmailService2,
  ) {
    this.fetchUsernamesByUserType1();
  }

  private async fetchUsernamesByUserType1() {
    try {
      const userType = 'Innovators'; // Set your desired userType here
      const users = await this.usersService.findUsersByUserType1(userType);
      this.cachedUsernames = users.map((user) => user.username);
      console.log('Cached Usernames:', this.cachedUsernames);
    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
  }

  async createExibitionWithSendEmail(
    createExhibitionDto: CreateExhibitionDto,
  ): Promise<Exhibition> {
    const userId = new Types.ObjectId(createExhibitionDto.userId);
    createExhibitionDto.userId = userId;
    const createdExhibition = new this.exhibitionModel(createExhibitionDto);
    const savedExhibition = await createdExhibition.save();
    this.inviteAllInnovators(savedExhibition);
    return savedExhibition;
  }

  async inviteAllInnovators(savedExhibition) {
    // Get all users with userType 'Innovators' using UsersService
    const users = await this.usersService.findUsersByUserType1('Innovators');

    // Send emails to all users
    const subject = 'New Exhibition Created';
    const exhibitionId = savedExhibition._id.toString();
    const title = savedExhibition.title;
    for (const user of users) {
      this.emailService.sendEmail2(
        user.username,
        subject,
        exhibitionId,
        title,
      );
    }
  }

  async createSendInnovators(
    sendToInnovatorsDto: SendToInnovatorsDto,
  ): Promise<SendToInnovators> {
    const sendInnovatorsFromExibition = new this.sendToInnovatorsModel(
      sendToInnovatorsDto,
    );
    return sendInnovatorsFromExibition.save();
  }

  async getSubmittedInnovators(userId: string): Promise<SendToInnovators[]> {
    console.log(
      `Querying database for submitted innovators with userId: ${userId}`,
    );
    const result = await this.sendToInnovatorsModel.find({ userId }).exec();
    // console.log(`Result from database: ${JSON.stringify(result)}`);
    return result;
  }

  // async findAll(
  //   page: number,
  //   limit: number,
  //   userId?: string,
  //   title?: string,
  //   industries?: string[],
  //   subjects?: string[],
  //   createdAt?: string,
  //   dateTime?: string,
  //   status?: string,
  // ): Promise<Exhibition[]> {
  //   const skip = (page - 1) * limit;
  //   const filter: any = {};

  //   const allNativeFiltersArray = {
  //     title,
  //     industries,
  //     subjects,
  //     createdAt,
  //     dateTime,
  //     status,
  //   };

  //   for (const key in allNativeFiltersArray) {
  //     if (Object.prototype.hasOwnProperty.call(allNativeFiltersArray, key)) {
  //       const element = allNativeFiltersArray[key];
  //       if (key === 'createdAt' && element) {
  //         const sameDateISOs = getSameDateISOs(element);
  //         filter[key] = {
  //           $gte: sameDateISOs.startOfDay,
  //           $lte: sameDateISOs.endOfDay,
  //         };
  //       } else if (key === 'userId' && element) {
  //         filter[key] = new Types.ObjectId(userId);
  //       } else if (element) {
  //         filter[key] = new RegExp(element, 'i');
  //       }
  //     }
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
  //         ...filter,
  //         ...(userId && {
  //           'userId._id': new Types.ObjectId(userId),
  //         }),
  //       },
  //     },
  //     { $sort: { createdAt: -1 } },
  //     { $skip: skip },
  //     { $limit: limit },
  //     {
  //       $project: {
  //         _id: 1,
  //         title: 1,
  //         description: 1,
  //         status: 1,
  //         meetingUrl: 1,
  //         industries: 1,
  //         subjects: 1,
  //         dateTime: 1,
  //         exhbTime: 1,
  //         username: 1,
  //         videoUrl: 1,
  //         innovators: 1,
  //         createdAt: 1,
  //         userId: { _id: 1, firstName: 1, lastName: 1, username: 1 },
  //       },
  //     },
  //   ];

  //   return await this.exhibitionModel.aggregate(pipeline);

  //   // return this.exhibitionModel
  //   //   .find(filter)
  //   //   .skip(skip)
  //   //   .sort({ createdAt: -1 })
  //   //   .limit(limit)
  //   //   .populate('userId', 'firstName lastName username', this.userModel)
  //   //   .exec();
  // }

  async findAll(
    page: number,
    limit: number,
    userId?: string,
    title?: string,
    industries?: string[],
    subjects?: string[],
    createdAt?: string,
    dateTime?: string,
    status?: string,
  ): Promise<Exhibition[]> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    const allNativeFiltersArray = {
      title,
      industries,
      subjects,
      createdAt,
      dateTime,
      status,
    };

    for (const key in allNativeFiltersArray) {
      if (Object.prototype.hasOwnProperty.call(allNativeFiltersArray, key)) {
        const element = allNativeFiltersArray[key];
        if (key === 'createdAt' && element) {
          const sameDateISOs = getSameDateISOs(element);
          filter[key] = {
            $gte: sameDateISOs.startOfDay,
            $lte: sameDateISOs.endOfDay,
          };
        } else if (key === 'userId' && element) {
          filter[key] = new Types.ObjectId(userId);
        } else if (element) {
          filter[key] = new RegExp(element, 'i');
        }
      }
    }

    const pipeline: PipelineStage[] = [
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
        $lookup: {
          from: 'booths',
          localField: '_id',
          foreignField: 'exhibitionId',
          as: 'booths',
        },
      },
      {
        $addFields: {
          boothCounts: {
            $reduce: {
              input: '$booths',
              initialValue: { pending: 0, approved: 0, rejected: 0 },
              in: {
                pending: {
                  $cond: [
                    { $eq: ['$$this.status', 'Pending'] },
                    { $add: ['$$value.pending', 1] },
                    '$$value.pending',
                  ],
                },
                approved: {
                  $cond: [
                    { $eq: ['$$this.status', 'Approved'] },
                    { $add: ['$$value.approved', 1] },
                    '$$value.approved',
                  ],
                },
                rejected: {
                  $cond: [
                    { $eq: ['$$this.status', 'Rejected'] },
                    { $add: ['$$value.rejected', 1] },
                    '$$value.rejected',
                  ],
                },
              },
            },
          },
        },
      },
      {
        $match: {
          ...filter,
          ...(userId && {
            'userId._id': new Types.ObjectId(userId),
          }),
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          meetingUrl: 1,
          industries: 1,
          subjects: 1,
          dateTime: 1,
          exhbTime: 1,
          username: 1,
          videoUrl: 1,
          innovators: 1,
          createdAt: 1,
          userId: { _id: 1, firstName: 1, lastName: 1, username: 1 },
          boothCounts: 1, // Include the booth counts in the output
        },
      },
    ];

    return await this.exhibitionModel.aggregate(pipeline);
  }

  async update(
    id: string,
    updateExhibitionDto: UpdateExhibitionDto,
  ): Promise<Exhibition> {
    const existingExhibition = await this.exhibitionModel.findById({ _id: id });
    console.log('update existingExhibition', existingExhibition);
    if (!existingExhibition) {
      throw new NotFoundException(`Exhibition with id ${id} not found`);
    }
    Object.assign(existingExhibition, updateExhibitionDto);
    return existingExhibition.save();
  }

  async delete(id: string): Promise<Exhibition> {
    const existingExhibitionDelete =
      await this.exhibitionModel.findByIdAndDelete({ _id: id });
    console.log('delete existingExhibition', existingExhibitionDelete);
    if (!existingExhibitionDelete) {
      throw new NotFoundException(`Exhibition with id ${id} not found`);
    }
    return existingExhibitionDelete;
  }

  async findOneExhibition(id: string): Promise<Exhibition> {
    try {
      const exhibition = await this.exhibitionModel
        .findById({ _id: id })
        .exec();
      if (!exhibition) {
        throw new NotFoundException(`Exhibition with id ${id} not found`);
      }
      return exhibition;
    } catch (error) {
      throw new NotFoundException(
        `Error retrieving exhibition: ${error.message}`,
      );
    }
  }
}
