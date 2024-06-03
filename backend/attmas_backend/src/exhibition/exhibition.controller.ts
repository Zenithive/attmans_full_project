import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { CreateExhibitionDto } from './create-exhibition.dto';
import { Exhibition } from './exhibition.schema';

@Controller('exhibitions')
export class ExhibitionController {
  constructor(private readonly exhibitionService: ExhibitionService) {}

  @Post()
  async create(
    @Body() createExhibitionDto: CreateExhibitionDto,
  ): Promise<Exhibition> {
    return this.exhibitionService.create(createExhibitionDto);
  }

  @Get()
  async findAll(): Promise<Exhibition[]> {
    return this.exhibitionService.findAll();
  }
}
