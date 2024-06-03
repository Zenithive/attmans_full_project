import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExhibitionDocument = Exhibition & Document;

@Schema()
export class Exhibition {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  industries: string[];

  @Prop({ type: [String], required: true })
  subjects: string[];
}

export const ExhibitionSchema = SchemaFactory.createForClass(Exhibition);
