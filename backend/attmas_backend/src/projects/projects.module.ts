import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from 'src/users/users.module';
import { JobsService } from './projects.service';
import { JobsController } from './projects.controller';
import { Jobs, JobsSchema } from './projects.schema';
import { EmailServices } from 'src/common/service/emailExibition';
import { EmailModule } from 'src/notificationEmail/Exebitionemail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Jobs.name, schema: JobsSchema }]),
    UsersModule,
    EmailModule,
  ],
  controllers: [JobsController],
  providers: [JobsService, EmailServices],
  exports: [JobsService],
})
export class JobsModule {}
