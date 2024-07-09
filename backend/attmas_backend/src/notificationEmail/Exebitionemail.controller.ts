// email.controller.ts
import { Controller, Get } from '@nestjs/common';
import { EmailService2 } from './Exebitionemail.service';
import { Email } from './Exebitionemail.schema';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService2) {}

  @Get()
  async findAll(): Promise<Email[]> {
    return this.emailService.findAllEmails();
  }
}
