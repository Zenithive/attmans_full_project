import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booth, BoothDocument } from './booth.schema';
import { CreateBoothDto } from './create-booth.dto';

@Injectable()
export class BoothService {
  constructor(
    @InjectModel(Booth.name) private boothModel: Model<BoothDocument>,
  ) {}

  async create(createBoothDto: CreateBoothDto): Promise<Booth> {
    const createdBooth = new this.boothModel(createBoothDto);
    return createdBooth.save();
  }

  async findAll(): Promise<Booth[]> {
    return this.boothModel.find().exec();
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
}
