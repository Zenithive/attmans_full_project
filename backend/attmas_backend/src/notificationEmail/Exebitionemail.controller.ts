import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EmailService2 } from './Exebitionemail.service';
import { Email } from './Exebitionemail.schema';
import { JwtAuthGuard } from 'src/auth1/guards/jwt-auths.guard';

@Controller('emails')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService2) {}

  @Get()
  async findAll(@Query('username') to: string): Promise<Email[]> {
    return this.emailService.findEmailsByUsername(to);
  }

  // email.controller.ts
  @Post('/markasread')
  async markAsRead(@Body('id') id: string): Promise<void> {
    await this.emailService.markAsRead(id);
  }
}
