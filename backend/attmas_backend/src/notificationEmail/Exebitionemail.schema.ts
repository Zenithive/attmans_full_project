// email.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  // @Prop({ type: Types.ObjectId, ref: 'exhibitions', required: false })
  // exibitionId: Types.ObjectId;
  @Prop({ required: false })
  exhibitionId: string;

  @Prop({ required: false })
  title: string;

  @Prop({ ref: 'booths', required: false })
  status: string;

  @Prop({ ref: 'booths', required: false })
  boothUsername: string;

  @Prop({ ref: 'exhibitions', required: false })
  exhibitionUserFirstName: string;

  @Prop({ ref: 'exhibitions', required: false })
  exhibitionUserLastName: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
