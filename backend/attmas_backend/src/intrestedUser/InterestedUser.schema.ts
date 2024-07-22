import { Schema, Document } from 'mongoose';

export interface InterestedUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    mobileNumber: string;
    userId: string;
    exhibitionId: string;
}

export const InterestedUserSchema = new Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    mobileNumber: { type: String, required: false },
    userId: { type: String, required: false },
    username: { type: String, required: false },
    exhibitionId: { type: String, required: false },
}, {
    timestamps: false,
});
