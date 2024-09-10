import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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
    const { applyId, milestoneText } = createBillingDto;

    // Validate applyId
    if (!mongoose.Types.ObjectId.isValid(applyId)) {
      throw new BadRequestException('Invalid applyId');
    }

    // Check if applyId exists
    const apply = await this.applyModel.findById(applyId);
    if (!apply) {
      throw new NotFoundException('Application not found');
    }

    // Check if milestone exists
    const milestone = await this.milestoneModel.findOne({
      'milestones.name.text': milestoneText,
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    // Find milestoneData with the provided milestoneText
    const milestoneData = milestone.milestones.find(
      (m) => m.name.text === milestoneText && m.status === 'Submitted',
    );
    if (!milestoneData) {
      throw new Error('Milestone is not submitted or text does not match');
    }

    // Create and save the billing record
    const createdBilling = new this.billingModel({
      ...createBillingDto,
      milestoneText: milestoneData.name.text,
    });
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

  async findByApplyId(applyId: string): Promise<Billing[]> {
    const result = await this.billingModel.find({ applyId }).exec();

    console.log('Billing Records Found:', result);

    if (result.length === 0) {
      console.warn(
        'No records found. Verify if any billing records exist with this applyId.',
      );
    }

    return result;
  }
}
