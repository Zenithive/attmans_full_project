import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MyController } from './redis.controller';
import { MyService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRoot({
      url: 'redis://127.0.0.1:6379',  // Redis server URL
      type: 'single',                 // Single Redis instance
    }),
  ],
  controllers: [MyController],
  providers: [MyService],
  exports: [RedisModule],
})
export class MyRedisModule {}
