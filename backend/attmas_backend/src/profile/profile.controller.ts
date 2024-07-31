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
import { ProductInfo, WorkExprience } from './schemas/work.exprience.schema';
import { Categories } from './schemas/category.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  //******** Post Request from main profile1 ********//

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

  //******** Post Request from main profile2 ********//

  @Post('form2')
  async createForm2(
    @Body() WorkExprience: WorkExprience,
  ): Promise<WorkExprience> {
    return this.profileService.createOrUpdateForm2(WorkExprience);
  }


 

  //******** Post Request from main profile3 ********//

  @Post('form3')
  async createForm3(@Body() Categories: Categories): Promise<Categories> {
    return this.profileService.createOrUpdateForm3(Categories);
  }

  //******** Get Request from profile completion check ********//

  @Get('form1')
  async getProfileData(@Query('username') username: string): Promise<PersonalProfile> {
    // console.log("username",username)
    return this.profileService.getProfileByUserId(username);
  }
  
  @Get('check')
  async checkProfileCompletion(@Query('username') username: string): Promise<{ profileCompleted: number }> {
    return this.profileService.getProfileCompletionStatus(username);
  }


  //******** Get Request from categories  for Freelancers and Innovators ********//
  @Get('categories')
  async getAllCategories(): Promise<Categories[]> {
    return this.profileService.getAllCategories();
  }


  //******** Get Request from Personal Profile for Edit Profile check ********//
  @Get('profileByUsername')
  async getProfileByUsername(@Query('username') username: string): Promise<PersonalProfile | null> {
    return this.profileService.getProfileByUsername(username);
  }


  //******** Get Request from WorkExprience for Edit Profile check ********//
  @Get('profileByUsername2')
  async getProfileByUsername2(@Query('username') username: string): Promise<WorkExprience | null> {
    return this.profileService.getProfileByUsername2(username);
  }


  //******** Get Request from categories for Edit Profile check ********//
  @Get('profileByUsername3')
  async getProfileByUsername3(@Query('username') username: string): Promise<Categories | null> {
    return this.profileService.getProfileByUsername3(username);
  }


  @Get('products')
async getProducts(@Query('username') username: string): Promise<ProductInfo[] | null> {
  return this.profileService.getProductNameByUsername(username);
}
}