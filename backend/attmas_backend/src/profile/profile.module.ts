import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PersonalProfile, ProfileSchema } from './schemas/personalProfile';
import { WorkExprience, WorkSchema } from './schemas/work.exprience.shema';
import { Categories, CategorySchema } from './schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PersonalProfile.name, schema: ProfileSchema },
      { name: WorkExprience.name, schema: WorkSchema },
      { name: Categories.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
