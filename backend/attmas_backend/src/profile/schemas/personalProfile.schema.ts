import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class PersonalProfile extends Document {
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

  @Prop({ required: false })
  linkedIn: string;

  @Prop({ required: false })
  workAddress: string;

  @Prop({ required: false })
  billingAddress: string;

  @Prop({ required: false })
  qualification: string;

  @Prop({ required: false })
  organization: string;

  @Prop({ required: false })
  sector: string;

  @Prop({ required: false })
  designation: string;

  @Prop({ required: false })
  userType: string;

  @Prop({ required: false })
  productToMarket: string;

  @Prop({ required: false })
  productName: string;

  @Prop({ required: false })
  productDescription: string;

  @Prop({ required: false })
  productType: string;

  @Prop({ required: false })
  productPrice: string;

  @Prop({ required: false })
  profilePhoto: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId: Types.ObjectId;

  @Prop({ required: false })
  username: string;

  @Prop({ required: false, enum: ['english', 'gujarati'] })
  language: string; // Added language field
}

export const ProfileSchema = SchemaFactory.createForClass(PersonalProfile);
