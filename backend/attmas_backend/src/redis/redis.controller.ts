import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MyService } from './redis.service';

@Controller('message')
export class MyController {
  constructor(private readonly myService: MyService) {}

  @Post('store')
  async storeMessage(@Body('message') message: string): Promise<string> {
    const key = 'hello-message'; // Static key for this example
    await this.myService.setMessage(key, message);
    return 'Message stored in Redis successfully';
  }

  @Get('retrieve/:key')
  async getMessage(@Param('key') key: string): Promise<string> {
    return this.myService.getMessage(key);
  }
}