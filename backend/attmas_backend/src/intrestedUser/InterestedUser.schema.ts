import { Schema, Document, Types } from 'mongoose';

export interface InterestedUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  mobileNumber: string;
  userId: Types.ObjectId; // Change type to ObjectId
  exhibitionId: Types.ObjectId; // Change type to ObjectId
  exhibitionName: string;
  boothId?: Types.ObjectId;
  boothTitle?: string;
  userType: string;
  interestType: 'InterestedUserForExhibition' | 'InterestedUserForBooth';
  adminEmail: string;
}

export const InterestedUserSchema = new Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    mobileNumber: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, required: false }, // Use Schema.Types.ObjectId
    username: { type: String, required: false },
    exhibitionId: { type: Schema.Types.ObjectId, required: false }, // Use Schema.Types.ObjectId
    exhibitionName: { type: String, required: false },
    boothTitle: { type: String, required: false },
    boothId: { type: Types.ObjectId, required: false },
    userType: { type: String, required: false },
    interestType: {
      type: String,
      enum: ['InterestedUserForExhibition', 'InterestedUserForBooth'],
      required: true,
    },
    adminEmail: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);
