import { Controller, Get, Query } from '@nestjs/common';
import { EmailService2 } from './Exebitionemail.service';
import { Email } from './Exebitionemail.schema';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService2) {}

  @Get()
  async findAll(@Query('username') to: string): Promise<Email[]> {
    return this.emailService.findEmailsByUsername(to);
  }
}
