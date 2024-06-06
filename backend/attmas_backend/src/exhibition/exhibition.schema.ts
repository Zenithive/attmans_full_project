import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExhibitionDocument = Exhibition & Document;

@Schema()
export class Exhibition {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ nullable: true })
  status: string;

  @Prop({ type: [String], required: true })
  industries: string[];

  @Prop({ type: [String], required: true })
  subjects: string[];

  @Prop({ required: true, default: Date.now })
  dateTime: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  userId: Types.ObjectId;
}

export const ExhibitionSchema = SchemaFactory.createForClass(Exhibition);
