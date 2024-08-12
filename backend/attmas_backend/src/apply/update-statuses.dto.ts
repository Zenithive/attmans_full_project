// update-statuses.dto.ts
import { IsArray, IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ApplicationStatusDto {
  @IsString()
  _id: string;

  @IsString()
  status: string;
}

export class UpdateStatusesDto {
  @IsArray()
  @Type(() => ApplicationStatusDto)
  applications: ApplicationStatusDto[];
}
