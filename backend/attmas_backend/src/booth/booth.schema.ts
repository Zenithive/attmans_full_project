import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoothDocument = Booth & Document;

@Schema()
export class Product {
  // @Prop({ required: false })
  // productName: string;

  // @Prop({ required: false })
  // productDescription: string;

  // @Prop({ required: true })
  // productType: string;

  // @Prop({ required: false })
  // productPrice: number;

  // @Prop({ required: false })
  // currency: string;

  // @Prop({ required: false })
  // videourlForproduct: string;

  @Prop({ required: false })
  _id: string;
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

  @Prop({ default: 'Pending' })
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
