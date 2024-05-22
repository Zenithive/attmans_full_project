import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: false })
  gender: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  state: string;

  @Prop({ required: false })
  pinCode: string;

  @Prop({ required: false })
  country: string;

  @Prop()
  picture: string;

  @Prop()
  linkedIn: string;

  @Prop()
  organizationName: string;

  @Prop()
  sector: string;

  @Prop()
  workAddress: string;

  @Prop()
  designation: string;

  @Prop()
  billingAddress: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
