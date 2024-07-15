import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoothDocument = Booth & Document;

@Schema()
class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  productType: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  currency: string;
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

  @Prop({ type: [ProductSchema], required: true })
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


}

export const BoothSchema = SchemaFactory.createForClass(Booth);

BoothSchema.post('save', async (doc, next) => {
  await doc.populate('userId');
  next();
});
