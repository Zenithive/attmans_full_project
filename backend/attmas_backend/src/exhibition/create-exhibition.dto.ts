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
  industries: string[];

  @IsNotEmpty()
  @IsString()
  subjects: string[];
}
