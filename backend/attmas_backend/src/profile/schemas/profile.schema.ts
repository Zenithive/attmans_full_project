import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Profile extends Document {
  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  pinCode: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  linkedIn: string;

  @Prop({ required: false })
  workAddress: string;

  @Prop()
  billingAddress: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
