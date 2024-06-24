/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  // Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PersonalProfile } from './schemas/personalProfile.schema';
import { WorkExprience } from './schemas/work.exprience.schema';
import { Categories } from './schemas/category.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post('form1')
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      storage: diskStorage({
        destination: './profilePhoto',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createForm1(
    @UploadedFile() profilePhoto: Express.Multer.File,
    @Body() profileData: PersonalProfile,
  ): Promise<PersonalProfile> {
    if (profilePhoto) {
      profileData.profilePhoto = join('profilePhoto', profilePhoto.filename); 
    }
    return this.profileService.createOrUpdateForm1(profileData);
  }

  @Post('form2')
  async createForm2(
    @Body() WorkExprience: WorkExprience,
  ): Promise<WorkExprience> {
    return this.profileService.createOrUpdateForm2(WorkExprience);
  }

  @Post('form3')
  async createForm3(@Body() Categories: Categories): Promise<Categories> {
    return this.profileService.createOrUpdateForm3(Categories);
  }

  @Get('form1')
  async getProfileData(@Query('username') username: string): Promise<PersonalProfile> {
    console.log("username",username)
    return this.profileService.getProfileByUserId(username);
  }
  
  @Get('check')
  async checkProfileCompletion(@Query('username') username: string): Promise<{ profileCompleted: number }> {
    return this.profileService.getProfileCompletionStatus(username);
  }
}