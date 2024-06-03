// import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET, // Use a secure secret key here
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1 hour
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Enable global validation pipes
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
