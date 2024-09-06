import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { ProductDto } from 'src/booth/create-booth.dto';

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
  @IsString()
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsNotEmpty()
  @IsEnum(['innovatorsApply', 'FreelancerApply'])
  applyType: string;
}
