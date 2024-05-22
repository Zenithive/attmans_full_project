import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserSchema } from 'src/users/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'attmas',
      useUnifiedTopology: true,
      synchronize: true, // Note: This should be false in production
    }),
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'swtsdfhuvbwjwkhv3243235',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, LocalStrategy, UsersService],
})
export class AuthModule {}
