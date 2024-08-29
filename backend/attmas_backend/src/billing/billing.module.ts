import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Billing, BillingSchema } from './billing.schema';
import { Milestone, MilestoneSchema } from 'src/milestone/milestone.schema';
import { Apply, ApplySchema } from 'src/apply/apply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Billing.name, schema: BillingSchema },
      { name: Milestone.name, schema: MilestoneSchema },
      { name: Apply.name, schema: ApplySchema },
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
