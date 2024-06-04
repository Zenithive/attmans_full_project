import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExhibitionDocument = Exhibition & Document;

@Schema()
export class Exhibition {
  [x: string]: any;
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  industries: string[];

  @Prop({ type: [String], required: true })
  subjects: string[];

  @Prop({ required: true, default: Date.now })
  dateTime: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ExhibitionSchema = SchemaFactory.createForClass(Exhibition);
