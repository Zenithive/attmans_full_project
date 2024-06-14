import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionController } from './exhibition.controller';
import { Exhibition, ExhibitionSchema } from './schema/exhibition.schema';
import {
  SendToInnovators,
  SendToInnovatorsSchema,
} from './schema/sendToInnovators.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exhibition.name, schema: ExhibitionSchema },
      { name: SendToInnovators.name, schema: SendToInnovatorsSchema },
    ]),
  ],
  controllers: [ExhibitionController],
  providers: [ExhibitionService],
  exports: [ExhibitionService],
})
export class ExhibitionModule {}
