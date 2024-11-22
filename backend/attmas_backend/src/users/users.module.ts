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
import { AuthService } from 'src/auth1/auths.service';
import { MyService } from 'src/redis/redis.service';
import { PersonalProfile, ProfileSchema } from 'src/profile/schemas/personalProfile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Categories.name, schema: CategorySchema },
      { name: PersonalProfile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailerService, JwtService,AuthService, MyService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
