import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class SendToInnovatorsDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  innovators: string[];

  @IsNotEmpty()
  @IsString()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  username: string;
}
