import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();

  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);

  // ✅ Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in DTO
      forbidNonWhitelisted: true, // throws error for extra properties
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  await app.listen(port);

  console.clear();
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();