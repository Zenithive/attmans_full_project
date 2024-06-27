import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SendToInnovatorsDocument = SendToInnovators & Document;

@Schema()
export class SendToInnovators {
  @Prop({ required: true })
  message: string;

  @Prop({ type: [String], required: true })
  innovators: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SendToInnovatorsSchema =
  SchemaFactory.createForClass(SendToInnovators);
