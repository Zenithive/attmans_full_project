import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Categories extends Document {
  @Prop({ required: false, type: [String] })
  categories: string[];

  @Prop({ required: false, type: [String] })
  subcategories: string[] | undefined;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId: Types.ObjectId;

  @Prop({ required: false })
  username: string;

  @Prop({ default: false })
  isComplete: boolean;
  Types: any;
}

export const CategorySchema = SchemaFactory.createForClass(Categories);
