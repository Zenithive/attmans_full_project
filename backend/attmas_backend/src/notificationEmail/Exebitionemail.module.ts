// email.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService2 } from './Exebitionemail.service';
import { EmailController } from './Exebitionemail.controller';
import { Email, EmailSchema } from './Exebitionemail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
  ],
  providers: [EmailService2],
  controllers: [EmailController],
  exports: [EmailService2],
})
export class EmailModule {}
