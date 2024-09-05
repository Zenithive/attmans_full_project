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

  @Get('/booth-visitors')
  async findVisitorsByBooth(@Query('boothId') boothId: string): Promise<any> {
    return this.interestedUserService.findVisitorsByBooth(boothId);
  }

  @Get('/booth-visitors-by-exhibition')
  async findVisitorsByBoothAndExhibition(
    @Query('boothId') boothId: string,
    @Query('exhibitionId') exhibitionId: string,
  ): Promise<any> {
    console.log('Booth ID:', boothId);
    console.log('Exhibition ID:', exhibitionId);
    return this.interestedUserService.findVisitorsByBoothAndExhibition(
      boothId,
      exhibitionId,
    );
  }

  @Get('/visitors-by-interest-type')
  async findVisitorsByInterestType(
    @Query('interestType') interestType: string,
    @Query('exhibitionId') exhibitionId: string,
  ): Promise<any> {
    return this.interestedUserService.findVisitorsByInterestType(
      interestType,
      exhibitionId,
    );
  }
}
