import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
// import { Types } from 'mongoose';

export class CreateJobsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  commentWhenProjectClose: string;
  @IsString()
  commentWhenProjectCloseByAdmin: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  Objective: string;

  @IsNotEmpty()
  @IsString()
  Expectedoutcomes: string;

  @IsNotEmpty()
  @IsString()
  IPRownership: string;

  @IsNotEmpty()
  @IsString()
  SelectService: string;

  @IsNotEmpty()
  @IsString()
  Expertiselevel: string;

  @IsNotEmpty()
  @IsString()
  ProductDescription: string;

  @IsNotEmpty()
  @IsString()
  Quantity: number;

  @IsNotEmpty()
  @IsString()
  Sector: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  DetailsOfInnovationChallenge: string;

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

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateJobsDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsString()
  commentWhenProjectClose?: string;

  @IsString()
  commentWhenProjectCloseByAdmin?: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsString()
  currency?: string;

  @IsNotEmpty()
  @IsString()
  Objective?: string;

  @IsNotEmpty()
  @IsString()
  Expected_out_comes?: string;

  @IsNotEmpty()
  @IsString()
  IPR_ownership?: string;

  @IsOptional()
  @IsString()
  SelectService?: string;

  @IsNotEmpty()
  @IsString()
  Expertiselevel?: string;

  @IsNotEmpty()
  @IsString()
  ProductDescription?: string;

  @IsNotEmpty()
  @IsString()
  Quantity?: number;

  @IsNotEmpty()
  @IsString()
  Sector?: string;

  @IsNotEmpty()
  @IsString()
  DetailsOfInnovationChallenge?: string;

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

  // @IsNotEmpty()
  // @IsString()
  // username?: string;
}

export class AddCommentDto {
  @IsNotEmpty()
  @IsString()
  commentText: string;

  @IsNotEmpty()
  @IsString()
  createdBy: string;
}
