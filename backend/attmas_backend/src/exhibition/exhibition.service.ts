import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
import { EmailServices } from 'src/common/service/emailExibition';

@Injectable()
export class ExhibitionService {
  [x: string]: any;
  constructor(
    @InjectModel(Exhibition.name)
    private exhibitionModel: Model<ExhibitionDocument>,
    @InjectModel(SendToInnovators.name)
    private sendToInnovatorsModel: Model<SendToInnovatorsDocument>,
    private usersService: UsersService,
    private readonly emailService: EmailServices,
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
    const createdExhibition = new this.exhibitionModel(createExhibitionDto);
    const savedExhibition = await createdExhibition.save();

    // Get all usernames using UsersService
    const users = await this.usersService.findUsersByUserType1('Innovators');
    const usernames = users.map((user) => user.username);

    // Send emails to all usernames
    const subject = 'New Exhibition Created';
    const message = `Dear User, a new exhibition ${savedExhibition.title} has been created.`;

    usernames.forEach(async (username) => {
      await this.emailService.sendEmail(username, subject, message);
    });

    return savedExhibition;
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

  async findAll(
    page: number,
    limit: number,
    userId?: string,
    industries?: string[],
    subjects?: string[],
  ): Promise<Exhibition[]> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (userId) {
      filter.userId = userId;
    }

    if (industries && industries.length > 0) {
      filter.industries = { $in: industries };
    }

    if (subjects && subjects.length > 0) {
      filter.subjects = { $in: subjects };
    }

    return this.exhibitionModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
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
    console.log('deleye existingExhibition', existingExhibitionDelete);
    if (!existingExhibitionDelete) {
      throw new NotFoundException(`Exhibition with id ${id} not found`);
    }
    return existingExhibitionDelete;
  }

  async findOneExhibition(id: string): Promise<Exhibition> {
    try {
      const exhibition = await this.exhibitionModel.findById(id).exec();
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
