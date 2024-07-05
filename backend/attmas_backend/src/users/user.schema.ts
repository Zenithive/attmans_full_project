import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  static categories: any;
  static subcategories: any;
  save(): User | PromiseLike<User> {
    throw new Error('Method not implemented.');
  }
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop()
  gender?: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  pinCode?: string;

  @Prop()
  country?: string;

  @Prop()
  picture?: string;

  @Prop()
  linkedIn?: string;

  @Prop()
  organizationName?: string;

  @Prop()
  sector?: string;

  @Prop()
  workAddress?: string;

  @Prop()
  designation?: string;

  @Prop()
  billingAddress?: string;

  @Prop()
  userType?: string;

  @Prop({ default: false })
  isAllProfileCompleted: boolean;

  // @Prop({ type: [{ type: Types.ObjectId, ref: 'Jobs' }] })
  // jobs: Types.ObjectId[];

  // @Prop({ type: [{ type: Types.ObjectId, ref: 'Exhibition' }] })
  // exhibitions: Types.ObjectId[];

  // @Prop({ type: [{ type: String }] }) // Assuming categories are stored as an array of strings
  // categories: string[];

  // @Prop({ type: [{ type: String }] }) // Assuming subcategories are stored as an array of strings
  // subcategories: string[];

  // _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
