import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterestedUserSchema } from './InterestedUser.schema';
import { InterestedUserService } from './interestedUser.service';
import { InterestedUserController } from './interestedUser.controller';
import { MailerService } from 'src/common/service/UserEmailSend';
import { UsersModule } from 'src/users/users.module';
import { ExhibitionModule } from 'src/exhibition/exhibition.module';
import { BoothModule } from 'src/booth/booth.module';
import { Booth, BoothSchema } from 'src/booth/booth.schema';
import {
  Email,
  EmailSchema,
} from 'src/notificationEmail/Exebitionemail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'InterestedUser', schema: InterestedUserSchema },
      { name: Booth.name, schema: BoothSchema },
      { name: Email.name, schema: EmailSchema },
    ]),
    UsersModule, // Import UsersModule
    ExhibitionModule,
    BoothModule,
  ],
  providers: [InterestedUserService, MailerService],
  controllers: [InterestedUserController],
  exports: [InterestedUserService, MailerService],
})
export class InterestedUserModule {}
