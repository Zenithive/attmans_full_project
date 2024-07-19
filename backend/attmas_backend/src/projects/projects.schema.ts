import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Types,
  // Types
} from 'mongoose';

export type JobsDocument = Jobs & Document;

@Schema()
export class Jobs {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  Objective: string;

  @Prop({ required: true })
  Expectedoutcomes: string;

  @Prop({ required: true })
  IPRownership: string;

  @Prop({ required: true })
  Expertiselevel: string;

  @Prop({ required: false })
  DetailsOfInnovationChallenge: string;

  @Prop({ required: false })
  Sector: string;

  @Prop({ required: false })
  AreaOfProduct: string;

  @Prop({ required: false })
  ProductDescription: string;

  @Prop({ type: [String], required: true })
  Category: string[];

  @Prop({ type: [String], required: true })
  Subcategorys: string[];

  @Prop({ type: [String], required: true })
  SelectService: string[];

  @Prop({ required: true, default: Date.now })
  TimeFrame: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  Budget: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  // user: Types.ObjectId;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ default: false })
  buttonsHidden: boolean;

  @Prop({ ref: 'User', required: true })
  username: string;

  @Prop({ type: Types.ObjectId, ref: 'Exhibition', required: false })
  exhibitionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'jobs', required: false })
  projectId: Types.ObjectId;
}

export const JobsSchema = SchemaFactory.createForClass(Jobs);

JobsSchema.post('save', async (doc, next) => {
  await doc.populate('userId');
  next();
});
