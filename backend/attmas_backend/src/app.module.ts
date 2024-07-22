import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth1/auths.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { ProfileModule } from './profile/profile.module';
import { ExhibitionModule } from './exhibition/exhibition.module';
import { JobsModule } from './projects/projects.module';
import { ApplyModule } from './apply/apply.module';
import { BoothModule } from './booth/booth.module';
import { EmailModule } from 'src/notificationEmail/Exebitionemail.module';
import { InterestedUserModule } from './intrestedUser/interestedUser.module';

dotenv.config();
console.log('process.env.MONGO_URL', process.env.URI);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forRoot('mongodb://127.0.0.1/attmas'),
    MongooseModule.forRoot(process.env.URI),
    UsersModule,
    AuthModule,
    ProfileModule,
    ExhibitionModule,
    JobsModule,
    ApplyModule,
    BoothModule,
    EmailModule,
    InterestedUserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
