import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsEmpty,
} from 'class-validator';

export class CreateBillingDto {
  @IsEmpty()
  @IsString()
  milestoneText: string;

  @IsNotEmpty()
  @IsString()
  applyId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  paymentDate: Date;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsString()
  @IsNotEmpty()
  currency: string;
}
