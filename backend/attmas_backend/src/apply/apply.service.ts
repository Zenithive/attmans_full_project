import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Apply, ApplyDocument } from './apply.schema';
import { CreateApplyDto } from './apply.dto';
import { User, UserDocument } from 'src/users/user.schema';
import { EmailService } from 'src/common/service/email.service';

@Injectable()
export class ApplyService {
  [x: string]: any;
  constructor(
    @InjectModel(Apply.name)
    private ApplyModel: Model<ApplyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
  ) {}

  // async create(createApplyDto: CreateApplyDto): Promise<Apply> {
  //   // console.log("CreateApplyDto", createApplyDto)
  //   const createdApply = new this.ApplyModel(createApplyDto);
  //   // console.log("createdApply", createdApply)
  //   return createdApply.save();
  // }

  async create(createApplyDto: CreateApplyDto): Promise<Apply> {
    const createdApply = new this.ApplyModel(createApplyDto);
    await createdApply.save();

    const user = await this.userModel
      .findOne({ username: createApplyDto.username })
      .exec();
    if (user) {
      const emailText = `
        Hi ${user.firstName},

        A new application has been created:
        
        Title: ${createApplyDto.title}
        Description: ${createApplyDto.description}
        Budget: ${createApplyDto.Budget}
        Time Frame: ${createApplyDto.TimeFrame}

        Best regards,
        Your Team
      `;
      console.log(user.username);
      await this.emailService.sendEmail({
        to: user.username,
        subject: 'New Application Created',
        text: emailText,
      });
    }
    // console.log('createdApply', createdApply);

    return createdApply;
  }

  async findAll(): Promise<Apply[]> {
    return this.jobsModel
      .find()
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
  }

  async findJobWithUser(id: string): Promise<Apply> {
    return this.jobsModel.findById(id).populate('user').exec();
  }
}
