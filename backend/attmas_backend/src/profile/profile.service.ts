import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './schemas/profile.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const createdProfile = new this.profileModel(createProfileDto);
    return createdProfile.save();
  }
}
