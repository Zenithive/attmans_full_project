import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoothService } from './booth.service';
import { BoothController } from './booth.controller';
import { Booth, BoothSchema } from './booth.schema';
import { UsersModule } from 'src/users/users.module';
import {
  Exhibition,
  ExhibitionSchema,
} from 'src/exhibition/schema/exhibition.schema';
import { EmailServices } from 'src/common/service/emailExibition';
import { EmailModule } from 'src/notificationEmail/Exebitionemail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booth.name, schema: BoothSchema },
      { name: Exhibition.name, schema: ExhibitionSchema },
    ]),
    UsersModule,
    EmailModule,
  ],
  controllers: [BoothController],
  providers: [BoothService, EmailServices],
  exports: [BoothService],
})
export class BoothModule {}
