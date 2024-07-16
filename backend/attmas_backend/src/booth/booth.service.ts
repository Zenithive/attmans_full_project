import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

    const exhibitionId = new Types.ObjectId(createBoothDto.exhibitionId);

    const exhibition = await this.exhibitionModel
      .findById(exhibitionId)
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
    console.log('exhibition', exhibition);
    console.log('booth', booth);
    if (exhibition) {
      const { username } = exhibition;
      await this.emailService.sendEmailtoExhibition(
        username,
        'New Booth Created',
        exhibitionId.toHexString(),
        booth.username,
        exhibition.title,
      );
    }

    return booth;
  }

  async findAll(status?: string): Promise<Booth[]> {
    const filter = status ? { status } : {};
    return this.boothModel
      .find(filter)
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
    const booth = await this.boothModel.findById(id);
    if (!booth) {
      throw new NotFoundException('Booth not found');
    }
    booth.status = 'Approved';
    booth.buttonsHidden = true;
    await booth.save();

    const exhibition = await this.exhibitionModel.findById(booth.exhibitionId);
    if (exhibition) {
      const exhibitionUser = await this.userModel.findById(exhibition.userId);
      await this.emailService.sendBoothStatusEmail(
        exhibitionUser.username,
        'Booth Approved',
        (exhibition._id as Types.ObjectId).toHexString(),
        booth.username,
        exhibition.title,
        'approved',
      );
    }

    return booth;
  }

  async rejectBooth(id: string): Promise<Booth> {
    const booth = await this.boothModel.findById(id);
    if (!booth) {
      throw new NotFoundException('Booth not found');
    }
    booth.status = 'Rejected';
    booth.buttonsHidden = true;
    await booth.save();

    const exhibition = await this.exhibitionModel.findById(booth.exhibitionId);
    if (exhibition) {
      const exhibitionUser = await this.userModel.findById(exhibition.userId);
      await this.emailService.sendBoothStatusEmail(
        exhibitionUser.username,
        'Booth Rejected',
        (exhibition._id as Types.ObjectId).toHexString(),
        booth.username,
        exhibition.title,
        'rejected',
      );
    }

    return booth;
  }

  async findByUsername(username: string): Promise<Booth> {
    const user = await this.boothModel.findOne({ username }).exec();
    return user;
  }
}
