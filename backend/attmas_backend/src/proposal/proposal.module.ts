import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProposalSchema } from './proposal.schema';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { Apply, ApplySchema } from 'src/apply/apply.schema';
import {
  Email,
  EmailSchema,
} from 'src/notificationEmail/Exebitionemail.schema';
import { UsersModule } from 'src/users/users.module';
import { Jobs, JobsSchema } from 'src/projects/projects.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Proposal', schema: ProposalSchema },
      { name: Apply.name, schema: ApplySchema },
      { name: Email.name, schema: EmailSchema },
      { name: Jobs.name, schema: JobsSchema },
    ]),
    UsersModule,
  ],
  providers: [ProposalService],
  controllers: [ProposalController],
  exports: [ProposalService, MongooseModule],
})
export class ProposalModule {}
