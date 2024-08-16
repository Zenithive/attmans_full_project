import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class MilestoneDto {
  @IsNotEmpty()
  @IsString()
  scopeOfWork: string;

  @IsArray()
  @IsString({ each: true })
  milestones: string[];
}
export class CreateApplyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  TimeFrame: Date;

  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  Budget: number;

  @IsNotEmpty()
  @IsString()
  currency: number;

  @IsNotEmpty()
  // @IsEmail()
  username: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNotEmpty()
  @IsString()
  jobId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  comment_Reward_Nonreward: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MilestoneDto)
  @IsArray()
  milestones?: MilestoneDto[];

  @IsNotEmpty()
  @IsString()
  availableSolution: string;

  @IsNotEmpty()
  @IsString()
  SolutionUSP: string;
}
