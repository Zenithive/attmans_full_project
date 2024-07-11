// email.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Email extends Document {
  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ default: Date.now })
  sentAt: Date;

  @Prop({ required: false })
  username: string;

  @Prop({ default: false })
  read: boolean;

  // @Prop({ type: Types.ObjectId, ref: 'exhibitions', required: false })
  // exibitionId: Types.ObjectId;

  @Prop({ required: false })
  exhibitionId: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
