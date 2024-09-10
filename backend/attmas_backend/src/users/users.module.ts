import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './user.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';
import {
  Categories,
  CategorySchema,
} from 'src/profile/schemas/category.schema';
import { MailerService } from 'src/common/service/UserEmailSend';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Categories.name, schema: CategorySchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailerService, JwtService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
