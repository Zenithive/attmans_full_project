import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booth, BoothDocument } from './booth.schema';
import { CreateBoothDto } from './create-booth.dto';
import { User, UserDocument } from 'src/users/user.schema';
import {
  Exhibition,
  ExhibitionDocument,
} from 'src/exhibition/schema/exhibition.schema';
import { EmailService2 } from 'src/notificationEmail/Exebitionemail.service';

@Injectable()
export class BoothService {
  constructor(
    @InjectModel(Booth.name) private boothModel: Model<BoothDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Exhibition.name)
    private exhibitionModel: Model<ExhibitionDocument>,
    private emailService: EmailService2,
  ) {}

  async create(createBoothDto: CreateBoothDto): Promise<Booth> {
    const createdBooth = new this.boothModel(createBoothDto);
    const booth = await createdBooth.save();

    if (createBoothDto.exhibitionId) {
      const exhibition = await this.exhibitionModel.findById(
        createBoothDto.exhibitionId,
      );
      if (exhibition) {
        const emailContent = `<p>Dear ${exhibition.username},</p>
    <p>You have been notified that ${booth.username} has requested to participate in the exhibition.</p>
    <p>Click <a href="http://localhost:4200/view-exhibition?exhibitionId=${exhibition._id}" target="_blank" rel="noopener noreferrer">here</a> to approve/reject.</p>`;

        await this.emailService.sendEmail2(
          exhibition.username,
          'New Booth Created',
          emailContent,
        );
      }
    }

    return booth;
  }

  async findAll(): Promise<Booth[]> {
    return this.boothModel
      .find()
      .populate('userId', 'firstName lastName', this.userModel)
      .exec();
  }

  async findOne(id: string): Promise<Booth> {
    const booth = await this.boothModel.findById(id).exec();
    if (!booth) {
      throw new NotFoundException(`Booth with id ${id} not found`);
    }
    return booth;
  }

  async delete(id: string): Promise<Booth> {
    const deletedBooth = await this.boothModel.findByIdAndDelete(id).exec();
    if (!deletedBooth) {
      throw new NotFoundException(`Booth with id ${id} not found`);
    }
    return deletedBooth;
  }

  async approveBooth(id: string): Promise<Booth> {
    const booth = await this.boothModel.findById({ _id: id });
    console.log('boothId for approve', booth);
    if (!booth) {
      throw new NotFoundException('Booth not found');
    }
    booth.status = 'Approved';
    console.log('booth status', booth.status);
    await booth.save();
    return booth;
  }

  async rejectBooth(id: string): Promise<Booth> {
    const booth = await this.boothModel.findById({ _id: id });
    console.log('boothId for reject', booth);
    if (!booth) {
      throw new NotFoundException('Booth not found');
    }
    booth.status = 'Rejected';
    await booth.save();
    return booth;
  }
}
