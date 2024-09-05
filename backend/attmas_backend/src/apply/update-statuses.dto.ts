// update-statuses.dto.ts
import { IsArray, IsString } from 'class-validator';
import { Types } from 'mongoose';

class ApplicationStatusDto {
  @IsString()
  _id: Types.ObjectId;

  @IsString()
  status: string;

  @IsString()
  jobId: Types.ObjectId;

  @IsString()
  comment_Reward_Nonreward: string;

  @IsString()
  userId: Types.ObjectId;

  @IsString()
  username: string;
}

export class UpdateStatusesDto {
  @IsArray()
  applications: ApplicationStatusDto[];
}
