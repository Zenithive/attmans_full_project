import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from './Exebitionemail.schema';

dotenv.config();

@Injectable()
export class EmailService2 {
  private transporter: nodemailer.Transporter;

  constructor(@InjectModel(Email.name) private emailModel: Model<Email>) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail2(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });
      console.log(`Email sent successfully to ${to}`);

      // Save email details to the database
      const email = new this.emailModel({ to, subject, text });
      await email.save();
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  }

  async findEmailsByUsername(to: string): Promise<Email[]> {
    return this.emailModel.find({ to: to }).exec();
  }
}
