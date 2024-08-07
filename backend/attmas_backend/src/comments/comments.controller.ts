import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AddCommentDto } from './create-comments.dto';
import { Comment } from './comments.schema';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() addCommentDto: AddCommentDto): Promise<Comment> {
    return this.commentsService.create(addCommentDto);
  }

  @Get('job/:jobId')
  async findByJobId(@Param('jobId') jobId: string): Promise<Comment[]> {
    return this.commentsService.findByJobId(jobId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Comment> {
    const comment = await this.commentsService.findOne(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }
}
