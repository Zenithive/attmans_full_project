import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from './Exebitionemail.schema';
import { UsersService } from 'src/users/users.service'; // Adjust path as needed

dotenv.config();

@Injectable()
export class EmailService2 {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(Email.name) private emailModel: Model<Email>,
    private usersService: UsersService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail2(
    to: string,
    subject: string,
    exhibitionId: string,
    title: string,
  ) {
    try {
      // Fetch user details from UsersService
      const user = await this.usersService.findByUsername(to);
      if (!user) {
        throw new Error(`User with username ${to} not found`);
      }

      // Customize email message with user's first name and last name
      const html = `
        Dear ${user.firstName} ${user.lastName},<br>
        You have been invited to participate in the exhibition "${title}". Click <a href="https://attmans.netlify.app/view-exhibition?exhibitionId=${exhibitionId}" target="_blank">here</a> to participate.
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
      console.log(`Email sent successfully to ${to}`);

      // Save email details to the database
      const email = new this.emailModel({
        to,
        subject,
        exhibitionId,
        read: false,
        sentAt: new Date(),
        title,
      });
      await email.save();
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  }

  async sendEmailProject(
    to: string,
    subject: string,
    projectId: string,
    title: string,
    first: string,
    last: string,
  ) {
    try {
      // Fetch user details from UsersService
      const user = await this.usersService.findByUsername(to);
      if (!user) {
        throw new Error(`User with username ${to} not found`);
      }

      // Customize email message with user's first name and last name
      const html = `
        Dear ${user.firstName} ${user.lastName},<br>
        You have been notified that "${first} ${last}"  had created  the Project "${title}".<br>

      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
      console.log(`Email sent successfully to ${to}`);

      // Save email details to the database
      const email = new this.emailModel({
        to,
        subject,
        projectId,
        read: false,
        sentAt: new Date(),
        title,
        first,
        last,
      });
      await email.save();
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  }

  async sendEmailtoExhibition(
    to: string,
    subject: string,
    exhibitionId: string,
    boothUsername: string,
    title: string,
  ) {
    try {
      const user = await this.usersService.findByUsername(to);
      if (!user) {
        throw new Error(`User with username ${to} not found`);
      }

      // const user2 = { username: '' };
      // const user2 = await this.boothService.findByUsername(to);
      // if (!user) {
      //   throw new Error(`User with username ${to} not found`);
      // }

      const html = `
        Dear ${user.firstName} ${user.lastName},<br>
        You have been notified that the ${boothUsername} has reqested to participate in the Exhibition "${title}" Click <a href="https://attmans.netlify.app/view-exhibition?exhibitionId=${exhibitionId}" target="_blank">here</a> to approve/reject.
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
      console.log(`Email sent successfully to ${to}`);

      const email = new this.emailModel({
        to,
        subject,
        exhibitionId,
        boothUsername,
        read: false,
        sentAt: new Date(),
        title,
      });
      await email.save();
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  }

  async sendBoothStatusEmail(
    to: string,
    subject: string,
    exhibitionId: string,
    title: string,
    status: string,
    boothUsername: string,
    exhibitionUserFirstName: string,
    exhibitionUserLastName: string,
  ) {
    try {
      // const exhibition =
      //   await this.usersService.findByUsername(exhibitionUsername);
      // if (!exhibition) {
      //   throw new Error(`User with username ${exhibitionUsername} not founds`);
      // }

      const user = await this.usersService.findByUsername(to);
      if (!user) {
        throw new Error(`User with username ${to} not found`);
      }

      const html = `
        Dear ${user.firstName} ${user.lastName},<br>
        your booth "${title}" request for exhibition is ${status} by "${exhibitionUserFirstName} ${exhibitionUserLastName}". Click <a href="https://attmans.netlify.app/view-exhibition?exhibitionId=${exhibitionId}" target="_blank">here</a> for more details.
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });

      const email = new this.emailModel({
        to,
        subject,
        sentAt: new Date(),
        read: false,
        exhibitionId,
        title,
        status,
        boothUsername,
        exhibitionUserFirstName,
        exhibitionUserLastName,
      });
      await email.save();
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  }

  async findEmailsByUsername(to: string): Promise<Email[]> {
    return this.emailModel.find({ to }).exec();
  }

  async sendProjectStatusEmail(
    to: string,
    subject: string,
    jobId: string,
    title: string,
    status2: string,
    adminFirstName: string,
    adminLastName: string,
  ) {
    try {
      const user = await this.usersService.findByUsername(to);
      if (!user) {
        throw new Error(`User with username ${to} not found`);
      }

      const html = `
        Dear ${user.firstName} ${user.lastName},<br>
        Your project "${title}" has been ${status2} by ${adminFirstName} ${adminLastName}.
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });

      const email = new this.emailModel({
        to,
        subject,
        sentAt: new Date(),
        read: false,
        jobId,
        title,
        status2,
        adminFirstName,
        adminLastName,
      });
      await email.save();
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  }

  async sendApplicationStatusEmail(
    to: string,
    subject: string,
    applicationId: string,
    title: string,
    status3: string,
    adminFirstName: string,
    adminLastName: string,
  ) {
    try {
      const user = await this.usersService.findByUsername(to);
      if (!user) {
        throw new Error(`User with username ${to} not found`);
      }

      const html = `
        Dear ${user.firstName} ${user.lastName},<br>
        Your application "${title}" has been ${status3} by ${adminFirstName} ${adminLastName}.
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });

      const email = new this.emailModel({
        to,
        subject,
        sentAt: new Date(),
        read: false,
        applicationId,
        title,
        status3,
        adminFirstName,
        adminLastName,
      });
      await email.save();
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  }

  // email.service2.ts
  async markAsRead(id: string): Promise<void> {
    await this.emailModel.findByIdAndUpdate(id, { read: true }).exec();
  }
}
