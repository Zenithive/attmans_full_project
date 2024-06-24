import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplyService } from './apply.service';
import { ApplyController } from './apply.controller';
import { Apply, ApplySchema } from './apply.schema';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from 'src/common/service/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Apply.name, schema: ApplySchema }]),
    UsersModule,
  ],
  controllers: [ApplyController],
  providers: [ApplyService, EmailService],
  exports: [ApplyService],
})
export class ApplyModule {}
