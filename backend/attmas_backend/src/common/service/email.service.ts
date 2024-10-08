import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from 'src/notificationEmail/Exebitionemail.schema';

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

  constructor(@InjectModel(Email.name) private emailModel: Model<Email>) {}

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
    applicationId,
    jobId,
  }: {
    to: string;
    applicationTitle: string;
    applicationId: string;
    jobId: string;
  }): Promise<void> {
    const subject = 'Congratulations! Your Application Has Been Awarded';
    const text = `Dear Applicant,

Congratulations!

We are pleased to inform you that your application for the job titled '${applicationTitle}' has been awarded. 

Thank you for your interest and effort.

Best regards,
Your Team`;
    await this.sendEmail({ to, subject, text });

    await this.saveEmail({
      to,
      subject,
      applicationTitle,
      awardStatus: 'Awarded',
      applicationId,
      jobId,
    });
  }

  async sendNotAwardedEmail({
    to,
    applicationTitle,
    applicationId,
    jobId,
  }: {
    to: string;
    applicationTitle: string;
    applicationId: string;
    jobId: string;
  }): Promise<void> {
    const subject = 'Application Update: Not Awarded';
    const text = `Dear Applicant,

Thank you for applying for the job titled '${applicationTitle}'.

We appreciate your interest, but unfortunately, your application was not selected for this opportunity. We encourage you to apply for other roles or opportunities with us in the future.

Best regards,
Your Team`;
    await this.sendEmail({ to, subject, text });

    await this.saveEmail({
      to,
      subject,
      applicationTitle,
      awardStatus: 'Not Awarded',
      applicationId,
      jobId,
    });
  }

  private async saveEmail({
    to,
    subject,
    applicationTitle,
    awardStatus,
    applicationId,
    jobId,
  }: {
    to: string;
    subject: string;
    applicationTitle: string;
    awardStatus: string;
    applicationId: string;
    jobId: string;
  }): Promise<void> {
    try {
      const email = new this.emailModel({
        to,
        subject,
        applicationTitle,
        awardStatus,
        applicationId,
        jobId,
        sentAt: new Date(),
        read: false,
      });
      await email.save();
      console.log('Email details saved to database');
    } catch (error) {
      console.error('Error saving email to database:', error);
    }
  }
}
