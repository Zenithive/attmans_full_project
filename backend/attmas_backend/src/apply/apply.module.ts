import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplyService } from './apply.service';
import { ApplyController } from './apply.controller';
import { Apply, ApplySchema } from './apply.schema';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from 'src/common/service/email.service';
import { EmailModule } from 'src/notificationEmail/Exebitionemail.module';
import { ProposalModule } from 'src/proposal/proposal.module';
import { JobsService } from 'src/projects/projects.service';
import { JobsModule } from 'src/projects/projects.module';
import { Jobs, JobsSchema } from 'src/projects/projects.schema';
import {
  Exhibition,
  ExhibitionSchema,
} from 'src/exhibition/schema/exhibition.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Apply.name, schema: ApplySchema },
      { name: Jobs.name, schema: JobsSchema },
      { name: Exhibition.name, schema: ExhibitionSchema },
    ]),
    UsersModule,
    EmailModule,
    JobsModule,
    ProposalModule,
  ],
  controllers: [ApplyController],
  providers: [ApplyService, EmailService, JobsService],
  exports: [ApplyService],
})
export class ApplyModule {}
