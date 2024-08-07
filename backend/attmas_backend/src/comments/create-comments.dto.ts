import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class AddCommentDto {
  @IsNotEmpty()
  @IsString()
  commentText: string;

  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  jobId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  applyId: string;
}
