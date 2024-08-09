// mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('process.env.EMAIL_USER', process.env.EMAIL_USER);
console.log('process.env.EMAIL_PASS', process.env.EMAIL_PASS);

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or any other service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: 'process.env.EMAIL_USER',
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
