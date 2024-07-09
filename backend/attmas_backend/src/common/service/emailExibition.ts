import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('process.env.EMAIL_USER', process.env.EMAIL_USER);
console.log('process.env.EMAIL_PASS', process.env.EMAIL_PASS);

@Injectable()
export class EmailServices {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // Configure your SMTP settings here
      // host: 'smtp.example.com',
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  }
}
