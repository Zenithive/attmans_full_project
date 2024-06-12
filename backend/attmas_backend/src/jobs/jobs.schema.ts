import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  // Types
} from 'mongoose';

export type JobsDocument = Jobs & Document;

@Schema()
export class Jobs {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  Expertiselevel: string;

  @Prop({ type: [String], required: true })
  Category: string[];

  @Prop({ type: [String], required: true })
  Subcategorys: string[];

  @Prop({ required: true, default: Date.now })
  TimeFrame: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: false })
  username: string;

  @Prop({ required: true })
  Budget: number;

  // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  // user: Types.ObjectId;
}

export const JobsSchema = SchemaFactory.createForClass(Jobs);
