import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class MilestoneNameDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  timeFrame: string;
}

class MilestoneItemDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MilestoneNameDto)
  name: MilestoneNameDto;

  @IsOptional()
  isCommentSubmitted?: boolean;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  submittedAt: Date;

  @IsNotEmpty()
  @IsEnum(['Pending', 'Approved', 'Rejected'])
  adminStatus: 'Pending' | 'Approved' | 'Rejected';

  @IsArray()
  @IsString({ each: true })
  adminComments: string[];
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
