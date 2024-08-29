import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BillingDocument = Billing & Document;

@Schema()
export class Billing {
  @Prop({ type: String, required: true })
  milestoneText: string;

  @Prop({ type: Types.ObjectId, ref: 'Apply', required: true })
  applyId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const BillingSchema = SchemaFactory.createForClass(Billing);
