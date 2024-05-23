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
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    JwtModule.registerAsync({
      //imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        // const secret = 'djkdkseudiwsa3';
        console.log('JWT_SECRET:', secret); // Debug line to verify the secret
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, LocalStrategy, UsersService],
})
export class AuthModule {}
