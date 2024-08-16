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

  async sendAwardedEmail({
    to,
    applicationTitle,
  }: {
    to: string;
    applicationTitle: string;
  }): Promise<void> {
    const subject = 'Congratulations! Your Application Has Been Awarded';
    const text = `Dear Applicant,

Congratulations!

We are pleased to inform you that your application for the job titled '${applicationTitle}' has been awarded. 

Thank you for your interest and effort.

Best regards,
Your Team`;
    await this.sendEmail({ to, subject, text });
  }

  async sendNotAwardedEmail({
    to,
    applicationTitle,
  }: {
    to: string;
    applicationTitle: string;
  }): Promise<void> {
    const subject = 'Application Update: Not Awarded';
    const text = `Dear Applicant,

Thank you for applying for the job titled '${applicationTitle}'.

We appreciate your interest, but unfortunately, your application was not selected for this opportunity. We encourage you to apply for other roles or opportunities with us in the future.

Best regards,
Your Team`;
    await this.sendEmail({ to, subject, text });
  }
}