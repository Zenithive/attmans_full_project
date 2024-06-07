import { IsNotEmpty, IsString } from 'class-validator';

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
  dateTime: Date;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  videoUrl: string;
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

  @IsNotEmpty()
  @IsString()
  videoUrl?: string;
}
