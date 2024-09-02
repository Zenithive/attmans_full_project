import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BOOTH_STATUSES } from 'src/common/constant/status.constant';

export type BoothDocument = Booth & Document;

@Schema()
export class Product {


  @Prop({ type: Types.ObjectId, required: false }) // Specify type as ObjectId
  _id?: Types.ObjectId;

  @Prop({ required: false })
  productName: string;


  @Prop({ required: false })
  CompetitiveAdvantages: string;


  @Prop({ required: false })
  challengesorrisks: string;

  @Prop({ required: false })
  currency: string;

  @Prop({ required: false })
  feasibilityofthesolution: string;

  @Prop({ required: false })
  howdoesthesolutionwork: string;

  @Prop({ required: false })
  intellectualpropertyconsiderations: string;

  @Prop({ required: false })
  potentialbenefits: string;

  @Prop({ required: false })
  problemaddressed: string;

  @Prop({ required: false })
  productDescription: string;
  
  @Prop({ required: false })
  productPrice: number;
  @Prop({ required: false })
  productQuantity: number;
  @Prop({ required: false })
  stageofdevelopmentdropdown: string;
  @Prop({ required: false })
  targetaudience: string;
  @Prop({ required: false })
  technologyused: string;
  @Prop({ required: false })
  videourlForproduct: string;
  
}

export const ProductSchema = SchemaFactory.createForClass(Product);

@Schema()
export class Booth {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  videoUrl: string;

  @Prop({ required: false })
  products: Product[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ ref: 'User', required: true })
  username: string;

  @Prop({ type: Types.ObjectId, ref: 'Exhibition', required: false })
  exhibitionId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: BOOTH_STATUSES.pending })
  status: string;

  @Prop({ default: false })
  buttonsHidden: boolean;

  @Prop({ required: false })
  rejectComment: string;
}

export const BoothSchema = SchemaFactory.createForClass(Booth);

BoothSchema.post('save', async (doc, next) => {
  await doc.populate('userId');
  next();
});
