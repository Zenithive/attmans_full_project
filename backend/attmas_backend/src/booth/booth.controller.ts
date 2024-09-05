import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BoothService } from './booth.service';
import { CreateBoothDto } from './create-booth.dto';
import { Booth } from './booth.schema';

@Controller('booths')
export class BoothController {
  constructor(private readonly boothService: BoothService) {}

  @Post()
  async create(@Body() createBoothDto: CreateBoothDto): Promise<Booth> {
    return this.boothService.create(createBoothDto);
  }

  // @Get('username/:username')
  // async findBoothProducts(@Param('username') username: string): Promise<Product[]> {
  //   return this.boothService.findBoothProduct(username);
  // }

  @Get()
  async findAll(
    @Query('status') status: string,
    @Query('exhibitionId') exhibitionId: string,
  ): Promise<Booth[]> {
    return this.boothService.findAll(status, exhibitionId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booth> {
    return this.boothService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Booth> {
    return this.boothService.delete(id);
  }

  @Post('approve/:id')
  async approveBooth(@Param('id') id: string): Promise<Booth> {
    return this.boothService.approveBooth(id);
  }

  @Post('reject/:id')
  async rejectBooth(
    @Param('id') id: string,
    @Body() body: { comment: string },
  ): Promise<Booth> {
    return this.boothService.rejectBooth(id, body.comment);
  }
}
