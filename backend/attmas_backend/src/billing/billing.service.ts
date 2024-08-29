import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Billing, BillingDocument } from './billing.schema';
import { CreateBillingDto } from './create-billing.dto';
import { Milestone, MilestoneDocument } from 'src/milestone/milestone.schema';
import { Apply, ApplyDocument } from 'src/apply/apply.schema';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Billing.name) private billingModel: Model<BillingDocument>,
    @InjectModel(Milestone.name)
    private milestoneModel: Model<MilestoneDocument>,
    @InjectModel(Apply.name) private applyModel: Model<ApplyDocument>,
  ) {}

  async create(createBillingDto: CreateBillingDto): Promise<Billing> {
    const milestone = await this.milestoneModel.findById(
      createBillingDto.milestoneId,
    );
    const apply = await this.applyModel.findById(createBillingDto.applyId);

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (!apply) {
      throw new NotFoundException('Application not found');
    }

    const milestoneData = milestone.milestones.find((m) =>
      m._id.equals(createBillingDto.milestoneId),
    );
    if (!milestoneData || milestoneData.status !== 'Submitted') {
      throw new Error('Milestone is not submitted');
    }

    const createdBilling = new this.billingModel(createBillingDto);
    return createdBilling.save();
  }

  async findAll(): Promise<Billing[]> {
    return this.billingModel.find().exec();
  }

  async findOne(id: string): Promise<Billing> {
    const billing = await this.billingModel.findById(id).exec();
    if (!billing) {
      throw new NotFoundException(`Billing with ID ${id} not found`);
    }
    return billing;
  }
}
