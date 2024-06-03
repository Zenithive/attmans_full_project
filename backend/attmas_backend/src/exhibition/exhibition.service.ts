import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exhibition, ExhibitionDocument } from './exhibition.schema';
import { CreateExhibitionDto } from './create-exhibition.dto';

@Injectable()
export class ExhibitionService {
  constructor(
    @InjectModel(Exhibition.name)
    private exhibitionModel: Model<ExhibitionDocument>,
  ) {}

  async create(createExhibitionDto: CreateExhibitionDto): Promise<Exhibition> {
    const createdExhibition = new this.exhibitionModel(createExhibitionDto);
    return createdExhibition.save();
  }

  async findAll(): Promise<Exhibition[]> {
    return this.exhibitionModel.find().exec();
  }
}
