import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('process.env.EMAIL_USER', process.env.EMAIL_USER);
console.log('process.env.EMAIL_PASS', process.env.EMAIL_PASS);

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendEmail({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
