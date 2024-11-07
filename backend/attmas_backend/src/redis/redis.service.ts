import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class MyService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // Store session ID in Redis
  async setMessage(key: string, value1: string): Promise<void> {
    await this.redis.set(key, value1);
  }

  // Retrieve session ID from Redis
  async getMessage(key: string): Promise<string> {
    return await this.redis.get(key);
  }

  // Delete session ID from Redis (for logging out or session invalidation)
  async deleteMessage(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
