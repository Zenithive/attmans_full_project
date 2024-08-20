import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class MilestoneItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  isCommentSubmitted?: boolean;

  @IsNotEmpty()
  @IsString()
  status: string;
}

export class CreateMilestoneDto {
  @IsNotEmpty()
  @IsString()
  scopeOfWork: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MilestoneItemDto)
  milestones: MilestoneItemDto[];

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
  @IsArray()
  @IsString({ each: true })
  milstonSubmitcomments?: string[];
}
