import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class CreateExhibitionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  industries: string[];

  @IsNotEmpty()
  @IsString()
  subjects: string[];

  @IsNotEmpty()
  @IsString()
  dateTime: string;

  @IsNotEmpty()
  @IsString()
  exhbTime: string;

  @IsNotEmpty()
  @IsString()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsUrl()
  videoUrl: string;

  @IsNotEmpty()
  @IsUrl()
  meetingUrl: string;

  userType: string;
}

export class UpdateExhibitionDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  status?: string;

  @IsNotEmpty()
  @IsString()
  industries?: string[];

  @IsNotEmpty()
  @IsString()
  subjects?: string[];

  @IsNotEmpty()
  @IsString()
  dateTime?: Date;

  @IsUrl()
  videoUrl?: string;

  @IsUrl()
  meetingUrl?: string;

  @IsNotEmpty()
  @IsString()
  userId: Types.ObjectId;
}
