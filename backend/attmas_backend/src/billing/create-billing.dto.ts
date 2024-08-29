import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateBillingDto {
  @IsNotEmpty()
  @IsString()
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
