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
  productQuantity: string;

  @Prop({ required: false })
  productType: string;

  @Prop({ required: false, type: Number })
  productPrice: number;

  @Prop({ required: false })
  currency: string;

  @Prop({ required: false })
  videourlForproduct: string;

  @Prop({ required: false })
  targetaudience: string;

  @Prop({ required: false })
  problemaddressed: string;

  @Prop({ required: false })
  technologyused: string;

  @Prop({ required: false })
  stageofdevelopmentdropdown: string;

  @Prop({ required: false })
  intellectualpropertyconsiderations: string;

  @Prop({ required: false })
  CompetitiveAdvantages: string;

  @Prop({ required: false })
  feasibilityofthesolution: string;

  @Prop({ required: false })
  howdoesthesolutionwork: string;

  @Prop({ required: false })
  potentialbenefits: string;

  @Prop({ required: false })
  challengesorrisks: string;
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
