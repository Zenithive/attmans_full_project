import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionController } from './exhibition.controller';
import { Exhibition, ExhibitionSchema } from './exhibition.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exhibition.name, schema: ExhibitionSchema },
    ]),
  ],
  controllers: [ExhibitionController],
  providers: [ExhibitionService],
  exports: [ExhibitionService],
})
export class ExhibitionModule {}
