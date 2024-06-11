import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import validator from 'validator';

export type ExhibitionDocument = Exhibition & Document;

@Schema()
export class Exhibition {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  status: string;

  @Prop({ type: [String], required: true })
  industries: string[];

  @Prop({ type: [String], required: true })
  subjects: string[];

  @Prop({ required: true, default: Date.now })
  dateTime: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: (props: any) => `${props.value} is not a valid URL!`,
    },
  })
  videoUrl: string;
}

export const ExhibitionSchema = SchemaFactory.createForClass(Exhibition);
