import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoothService } from './booth.service';
import { BoothController } from './booth.controller';
import { Booth, BoothSchema } from './booth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booth.name, schema: BoothSchema }]),
  ],
  controllers: [BoothController],
  providers: [BoothService],
  exports: [BoothService],
})
export class BoothModule {}
