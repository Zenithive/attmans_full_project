import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
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

  @Get()
  async findAll(): Promise<Booth[]> {
    return this.boothService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booth> {
    return this.boothService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Booth> {
    return this.boothService.delete(id);
  }
}
