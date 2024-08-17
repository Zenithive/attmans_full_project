import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

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
  @IsString()
  availableSolution: string;

  @IsNotEmpty()
  @IsString()
  SolutionUSP: string;
}
