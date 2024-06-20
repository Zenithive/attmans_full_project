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

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const ApplySchema = SchemaFactory.createForClass(Apply);
