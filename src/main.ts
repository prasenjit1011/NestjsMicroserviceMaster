import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // Load .env before anything else
  console.clear();
  console.log('PORT : ', process.env.PORT)
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  console.log('PORT : ', process.env.PORT)
}
bootstrap();
