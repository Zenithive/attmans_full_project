import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import validator from 'validator';

export type ExhibitionDocument = Exhibition & Document;

@Schema()
export class Exhibition {
  toObject(): Exhibition | PromiseLike<Exhibition> {
    throw new Error('Method not implemented.');
  }
  @Prop({ required: false })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  status: string;

  @Prop()
  meetingUrl: string;

  @Prop({ type: [String], required: false })
  industries: string[];

  @Prop({ type: [String], required: false })
  subjects: string[];

  @Prop({ required: true, default: Date.now })
  dateTime: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  // New fields for sending to innovators
  @Prop({ required: false })
  message?: string;

  @Prop({
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: (props: any) => `${props.value} is not a valid URL!`,
    },
  })
  videoUrl: string;

  @Prop({ type: [String], required: false })
  innovators?: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userIdForInnovators?: Types.ObjectId;

  @Prop({ required: false })
  usernameForInnovators?: string;
}

export const ExhibitionSchema = SchemaFactory.createForClass(Exhibition);
