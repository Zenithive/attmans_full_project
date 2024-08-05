import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InterestedUserService } from './interestedUser.service';

@Controller('interested-users')
export class InterestedUserController {
  constructor(private readonly interestedUserService: InterestedUserService) {}

  @Post()
  async create(@Body() createInterestedUserDto: any): Promise<any> {
    return this.interestedUserService.create(createInterestedUserDto);
  }

  @Get()
  async findVisitorsByExhibition(
    @Query('exhibitionId') exhibitionId: string,
  ): Promise<any> {
    return this.interestedUserService.findVisitorsByExhibition(exhibitionId);
  }

  @Get('/user-interests')
  async findExhibitionsByUser(@Query('userId') userId: string): Promise<any> {
    return this.interestedUserService.findExhibitionsByUser(userId);
  }
}
