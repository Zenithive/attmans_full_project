import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WorkExprience extends Document {
  @Prop({ required: false })
  workAddress: string;

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
  userId: string;

  @Prop({ required: false })
  username: string;
}

export const WorkSchema = SchemaFactory.createForClass(WorkExprience);
