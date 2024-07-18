import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import {
  CreateExhibitionDto,
  UpdateExhibitionDto,
} from './dto/create-exhibition.dto';
import { Exhibition } from './schema/exhibition.schema';
import { SendToInnovatorsDto } from './dto/send-to-innovators.dto';
import { SendToInnovators } from './schema/sendToInnovators.schema';

@Controller('exhibitions')
export class ExhibitionController {
  constructor(private readonly exhibitionService: ExhibitionService) {}

  @Post()
  async create(
    @Body() createExhibitionDto: CreateExhibitionDto,
  ): Promise<Exhibition> {
    return this.exhibitionService.createExibitionWithSendEmail(
      createExhibitionDto,
    );
  }

  @Post('sendinovators')
  async createSendInnovators(
    @Body() sendToInnovatorsDto: SendToInnovatorsDto,
  ): Promise<SendToInnovators> {
    return this.exhibitionService.createSendInnovators(sendToInnovatorsDto);
  }

  @Get('submitted-innovators')
  async getSubmittedInnovators(
    @Query('userId') userId: string,
  ): Promise<SendToInnovators[]> {
    console.log(`Fetching submitted innovators for userId: ${userId}`);
    return this.exhibitionService.getSubmittedInnovators(userId);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('industries') industries: string[] = [],
    @Query('subjects') subjects: string[] = [],
    @Query('userId') userId?: string,
  ): Promise<Exhibition[]> {
    return this.exhibitionService.findAll(
      page,
      limit,
      userId,
      industries,
      subjects,
    );
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<Exhibition> {
  //   const exhibition = await this.exhibitionService.findExhibitionWithUser(id);
  //   if (!exhibition) {
  //     throw new NotFoundException(`Exhibition with id ${id} not found`);
  //   }
  //   return exhibition;
  // }

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
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      const exhibition = await this.exhibitionService.findOneExhibition(id);
      if (!exhibition) {
        throw new NotFoundException(`Exhibition with id ${id} not found`);
      }

      const serverDate = new Date();
      const exhibitionObject = exhibition.toObject();

      const mergedData = {
        ...exhibitionObject,
        serverDate,
      };
      console.log('merged', mergedData);
      return mergedData;
    } catch (error) {
      throw new NotFoundException(
        `Error retrieving exhibition: ${error.message}`,
      );
    }
  }
}
