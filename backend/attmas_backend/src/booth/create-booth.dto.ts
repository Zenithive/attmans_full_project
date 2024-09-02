import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class ProductDto {
  
  // @IsNotEmpty()
  @Type(() => String) // Ensure _id is treated as a string for validation
  _id: Types.ObjectId;


  // @IsNotEmpty()
  @IsString()
  productName: string;
  // @IsNotEmpty()
  @IsString()
  CompetitiveAdvantages: string;
  // @IsNotEmpty()
  @IsString()
  challengesorrisks: string;
  // @IsNotEmpty()
  @IsString()
  currency: string;
  // @IsNotEmpty()
  @IsString()
  feasibilityofthesolution: string;
  // @IsNotEmpty()
  @IsString()
  howdoesthesolutionwork: string;
  // @IsNotEmpty()
  @IsString()
  intellectualpropertyconsiderations: string;
  // @IsNotEmpty()
  @IsString()
  potentialbenefits: string;
  // @IsNotEmpty()
  @IsString()
  problemaddressed: string;
  // @IsNotEmpty()
  @IsString()
  productDescription: string;
  // @IsNotEmpty()
  @IsString()
  technologyused: string;
  // @IsNotEmpty()
  @IsString()
  videourlForproduct: string;
  // @IsNotEmpty()
  @IsString()
  stageofdevelopmentdropdown: string;
  // @IsNotEmpty()
  @IsString()
  targetaudience: string;
  // @IsNotEmpty()
  @IsNumber()
  productPrice: string;
  // @IsNotEmpty()
  @IsNumber()
  productQuantity: number;
  // @IsNotEmpty()
 
}

export class CreateBoothDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  videoUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsNotEmpty()
  @IsString()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  exhibitionId: Types.ObjectId | string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsString()
  @IsOptional()
  rejectComment?: string;
}
