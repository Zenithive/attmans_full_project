import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionController } from './exhibition.controller';
import { UsersModule } from 'src/users/users.module';
import { Exhibition, ExhibitionSchema } from './schema/exhibition.schema';
import {
  SendToInnovators,
  SendToInnovatorsSchema,
} from './schema/sendToInnovators.schema';
import { EmailServices } from 'src/common/service/emailExibition';
import { EmailModule } from 'src/notificationEmail/Exebitionemail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exhibition.name, schema: ExhibitionSchema },
      { name: SendToInnovators.name, schema: SendToInnovatorsSchema },
    ]),
    UsersModule,
    EmailModule,
  ],
  controllers: [ExhibitionController],
  providers: [ExhibitionService, EmailServices],
  exports: [ExhibitionService, MongooseModule],
})
export class ExhibitionModule {}
