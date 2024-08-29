import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MilestoneDocument = Milestone & Document;

@Schema()
export class Milestone {
  @Prop({ required: true })
  scopeOfWork: string;

  @Prop({
    type: [
      {
        name: {
          text: { type: String, required: true },
          timeFrame: { type: Date, required: true },
        },
        isCommentSubmitted: { type: Boolean, default: false },
        status: { type: String, default: 'Pending' },
        submittedAt: { type: Date },
        adminStatus: {
          type: String,
          enum: ['Pending', 'Approved', 'Rejected'],
          default: 'Pending',
        },
        adminComments: { type: [String], default: [] },
      },
    ],
    required: true,
  })
  milestones: {
    name: {
      text: string;
      timeFrame: Date;
    };
    isCommentSubmitted: boolean;
    status: string;
    submittedAt?: Date;
    adminStatus: 'Pending' | 'Approved' | 'Rejected';
    adminComments: string[];
  }[];

  @Prop({ type: Types.ObjectId, ref: 'Apply', required: true })
  applyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  milstonSubmitcomments: string[];

  @Prop({ type: [String], default: [] })
  adminComments: string[];

  @Prop({ default: false })
  isCommentSubmitted: boolean;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
