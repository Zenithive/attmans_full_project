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

@Injectable()
export class ExhibitionService {
  [x: string]: any;
  constructor(
    @InjectModel(Exhibition.name)
    private exhibitionModel: Model<ExhibitionDocument>,
    @InjectModel(SendToInnovators.name)
    private sendToInnovatorsModel: Model<SendToInnovatorsDocument>,
  ) {}

  async create(createExhibitionDto: CreateExhibitionDto): Promise<Exhibition> {
    const createdExhibition = new this.exhibitionModel(createExhibitionDto);
    return createdExhibition.save();
  }

  async createSendInnovators(
    sendToInnovatorsDto: SendToInnovatorsDto,
  ): Promise<SendToInnovators> {
    const sendInnovatorsFromExibition = new this.sendToInnovatorsModel(
      sendToInnovatorsDto,
    );
    return sendInnovatorsFromExibition.save();
  }

  async findAll(): Promise<Exhibition[]> {
    return this.exhibitionModel.find().exec();
  }

  async findExhibitionWithUser(id: string): Promise<Exhibition> {
    return this.exhibitionModel.findById(id).populate('userId').exec();
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
}
