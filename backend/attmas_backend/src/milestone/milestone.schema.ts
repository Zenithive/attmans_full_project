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
        name: { type: String, required: true },
        isCommentSubmitted: { type: Boolean, default: false },
        status: { type: String, default: 'Pending' },
      },
    ],
    required: true,
  })
  milestones: {
    name: string;
    isCommentSubmitted: boolean;
    status: string;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'Apply', required: true })
  applyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  milstonSubmitcomments: string[];

  @Prop({ default: false })
  isCommentSubmitted: boolean;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
