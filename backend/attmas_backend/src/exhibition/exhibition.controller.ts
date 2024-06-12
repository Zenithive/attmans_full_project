import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import {
  CreateExhibitionDto,
  UpdateExhibitionDto,
} from './create-exhibition.dto';
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Exhibition> {
    const exhibition = await this.exhibitionService.findExhibitionWithUser(id);
    if (!exhibition) {
      throw new NotFoundException(`Exhibition with id ${id} not found`);
    }
    return exhibition;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExhibitionDto: UpdateExhibitionDto,
  ): Promise<Exhibition> {
    const updatedExhibition = await this.exhibitionService.update(
      id,
      updateExhibitionDto,
    );
    if (!updatedExhibition) {
      throw new NotFoundException(`Exhibition with id ${id} not found`);
    }
    return updatedExhibition;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Exhibition> {
    const deletedExhibition = await this.exhibitionService.delete(id);
    if (!deletedExhibition) {
      throw new NotFoundException(`Exhibition with id ${id} not found`);
    }
    return deletedExhibition;
  }
}
