import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AddCommentDto } from './create-comments.dto';
import { Comment } from './comments.schema';
import { JwtAuthGuard } from 'src/auth1/guards/jwt-auths.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() addCommentDto: AddCommentDto): Promise<Comment> {
    return this.commentsService.create(addCommentDto);
  }

  @Get('job/:jobId/apply/:applyId')
  async findByJobAndApply(
    @Param('jobId') jobId: string,
    @Param('applyId') applyId: string,
  ): Promise<Comment[]> {
    return this.commentsService.findByJobAndApply(jobId, applyId);
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
