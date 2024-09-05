import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplyService } from './apply.service';
import { ApplyController } from './apply.controller';
import { Apply, ApplySchema } from './apply.schema';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from 'src/common/service/email.service';
import { EmailModule } from 'src/notificationEmail/Exebitionemail.module';
import { ProposalModule } from 'src/proposal/proposal.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Apply.name, schema: ApplySchema }]),
    UsersModule,
    EmailModule,
    ProposalModule,
  ],
  controllers: [ApplyController],
  providers: [ApplyService, EmailService],
  exports: [ApplyService],
})
export class ApplyModule {}
