import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile1, ProfileSchema } from './schemas/profile.schema';
import { WorkExprience, WorkSchema } from './schemas/work.exprience.shema';
import { Categories, CategorySchema } from './schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile1.name, schema: ProfileSchema },
      { name: WorkExprience.name, schema: WorkSchema },
      { name: Categories.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
