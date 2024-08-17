import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MilestoneDocument = Milestone & Document;

@Schema()
export class Milestone {
  @Prop({ required: true })
  scopeOfWork: string;

  @Prop({ type: [String], required: true })
  milestones: string[];

  @Prop({ type: Types.ObjectId, ref: 'Apply', required: true })
  applyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ default: 'Pending' })
  status: string;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
