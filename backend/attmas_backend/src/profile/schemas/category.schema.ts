import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Categories extends Document {
  @Prop({ required: false, type: [String] })
  categories: string[];

  @Prop({ required: false, type: [String] })
  subcategories: string[] | undefined;
}

export const CategorySchema = SchemaFactory.createForClass(Categories);
