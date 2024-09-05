import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProposalSchema } from './proposal.schema';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { Apply, ApplySchema } from 'src/apply/apply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Proposal', schema: ProposalSchema },
      { name: Apply.name, schema: ApplySchema },
    ]),
  ],
  providers: [ProposalService],
  controllers: [ProposalController],
  exports: [ProposalService, MongooseModule],
})
export class ProposalModule {}
