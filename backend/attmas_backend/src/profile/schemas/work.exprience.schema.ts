import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the ProductInfo schema
@Schema()
export class ProductInfo {
  @Prop({ required: false })
  productName: string;

  @Prop({ required: false })
  productDescription: string;

  @Prop({ required: false })
  productType: string;

  @Prop({ required: false, type: Number })
  productPrice: string;

  @Prop({ required: false })
  currency: string;

  @Prop({ required: false })
  videourlForproduct: string;
}

export const ProductInfoSchema = SchemaFactory.createForClass(ProductInfo);

// Define the WorkExperience schema
@Schema()
export class WorkExprience extends Document {
  @Prop({ required: false })
  workAddress: string;

  @Prop({ required: false })
  productToMarket: string;

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
  patentDetails: string;

  @Prop({ type: [ProductInfoSchema], required: false }) // Use array of ProductInfo schema
  products: ProductInfo[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId: Types.ObjectId;

  @Prop({ required: false })
  username: string;

  @Prop({ required: false, type: String }) // Ensure the type is String
  hasPatent: string;
}

export const WorkSchema = SchemaFactory.createForClass(WorkExprience);
