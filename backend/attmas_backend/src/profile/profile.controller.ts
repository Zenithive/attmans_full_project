import { Body, Controller, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile1 } from './schemas/profile.schema';
import { WorkExprience } from './schemas/work.exprience.shema';
import { Categories } from './schemas/category.schema';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('form1')
  async createForm1(@Body() Profile1: Profile1): Promise<Profile1> {
    return this.profileService.createForm1(Profile1);
  }

  @Post('form2')
  async createForm2(
    @Body() WorkExprience: WorkExprience,
  ): Promise<WorkExprience> {
    return this.profileService.createForm2(WorkExprience);
  }

  @Post('form3')
  async createForm3(@Body() Categories: Categories): Promise<Categories> {
    return this.profileService.createForm3(Categories);
  }
}
