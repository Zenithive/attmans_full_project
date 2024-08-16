// update-statuses.dto.ts
import { IsArray, IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ApplicationStatusDto {
  @IsString()
  _id: string;

  @IsString()
  status: string;
  
  @IsString()
  jobId: string;

  @IsString()
  comment_Reward_Nonreward: string;

  @IsString()
  userId: string;
  
  @IsString()
  username: string;


}

export class UpdateStatusesDto {
  @IsArray()
  @Type(() => ApplicationStatusDto)
  applications: ApplicationStatusDto[];
}
