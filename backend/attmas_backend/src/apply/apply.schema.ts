import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Types,
  // Types
} from 'mongoose';

export type ApplyDocument = Apply & Document;

@Schema()
export class Apply {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: Date.now })
  TimeFrame: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  Budget: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: false })
  username: string;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ required: false })
  rejectComment: string;

  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ default: false })
  buttonsHidden: boolean;
}

export const ApplySchema = SchemaFactory.createForClass(Apply);
