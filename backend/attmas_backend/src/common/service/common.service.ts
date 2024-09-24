import { Types } from 'mongoose';

export const getObjectId = (stringId: string) => {
  return new Types.ObjectId(stringId);
};
