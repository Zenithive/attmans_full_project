
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService2 } from './Exebitionemail.service';
import { Email, EmailSchema } from './Exebitionemail.schema';
import { UsersModule } from 'src/users/users.module'; // Adjust path as needed
import { User } from 'src/users/user.schema'; // Adjust path as needed
import { EmailController } from './Exebitionemail.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
    UsersModule,
    MongooseModule.forFeature([{ name: 'User', schema: User }]), // Import UserModel here
  ],
  providers: [EmailService2],
  controllers: [EmailController],
  exports: [EmailService2],
})
export class EmailModule {}
