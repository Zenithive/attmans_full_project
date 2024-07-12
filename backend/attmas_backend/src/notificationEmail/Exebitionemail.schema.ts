// email.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Email extends Document {
  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  sentAt: Date;

  @Prop({ required: false })
  username: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
