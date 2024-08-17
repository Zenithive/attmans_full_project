import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateMilestoneDto {
  @IsNotEmpty()
  @IsString()
  scopeOfWork: string;

  @IsArray()
  @IsString({ each: true })
  milestones: string[];

  @IsNotEmpty()
  @IsMongoId()
  applyId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  jobId: Types.ObjectId;

  @IsOptional()
  @IsString()
  status?: string;
}
