import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  readonly gender: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @IsString()
  @IsNotEmpty()
  readonly pinCode: string;

  @IsString()
  @IsNotEmpty()
  readonly country: string;

  @IsUrl()
  @IsNotEmpty()
  readonly linkedIn: string;

  // @IsString()
  // @IsNotEmpty()
  // readonly workAddress: string;

  @IsString()
  readonly billingAddress: string;
}
