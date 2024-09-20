import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Milestone, MilestoneSchema } from './milestone.schema';
import { User, UserSchema } from '../users/user.schema';
import { Jobs, JobsSchema } from 'src/projects/projects.schema';
import { Apply, ApplySchema } from '../apply/apply.schema';
import { MilestonesService } from './milestone.service';
import { MilestonesController } from './milestone.controller';
import {
  Email,
  EmailSchema,
} from 'src/notificationEmail/Exebitionemail.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Milestone.name, schema: MilestoneSchema },
      { name: User.name, schema: UserSchema },
      { name: Jobs.name, schema: JobsSchema },
      { name: Apply.name, schema: ApplySchema },
      { name: Email.name, schema: EmailSchema },
    ]),
    UsersModule,
  ],
  controllers: [MilestonesController],
  providers: [MilestonesService],
  exports: [MilestonesService],
})
export class MilestonesModule {}
