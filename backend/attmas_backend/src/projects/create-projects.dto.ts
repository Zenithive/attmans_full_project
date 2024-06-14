import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
// import { Types } from 'mongoose';

export class CreateJobsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  Expertiselevel: string;

  @IsNotEmpty()
  @IsString()
  Category: string[];

  @IsNotEmpty()
  @IsString()
  Subcategorys: string[];

  @IsNotEmpty()
  @IsString()
  TimeFrame: Date;

  @IsNotEmpty()
  @IsString()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  Budget: number;
}

export class UpdateJobsDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  Expertiselevel?: string;

  @IsNotEmpty()
  @IsString()
  Category?: string[];

  @IsNotEmpty()
  @IsString()
  Subcategorys?: string[];

  @IsNotEmpty()
  @IsString()
  TimeFrame?: Date;

  @IsNotEmpty()
  @IsString()
  Budget?: number;
}
