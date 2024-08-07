import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment, CommentSchema } from './comments.schema';
import { User, UserSchema } from 'src/users/user.schema';
import { Jobs, JobsSchema } from 'src/projects/projects.schema';
import { Apply, ApplySchema } from 'src/apply/apply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Jobs.name, schema: JobsSchema },
      { name: Apply.name, schema: ApplySchema },
    ]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
