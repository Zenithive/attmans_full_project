import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterestedUserSchema } from './InterestedUser.schema';
import { InterestedUserService } from './interestedUser.service';
import { InterestedUserController } from './interestedUser.controller';
import { MailerService } from 'src/common/service/UserEmailSend';
import { UsersModule } from 'src/users/users.module';
import { ExhibitionModule } from 'src/exhibition/exhibition.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'InterestedUser', schema: InterestedUserSchema },
    ]),
    UsersModule, // Import UsersModule
    ExhibitionModule,
  ],
  providers: [InterestedUserService, MailerService],
  controllers: [InterestedUserController],
  exports: [InterestedUserService, MailerService],
})
export class InterestedUserModule {}
