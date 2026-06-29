import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

export async function bootstrap() {
  dotenv.config();

  console.clear();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT);

  console.log('PORT : ', process.env.PORT);
}

// Run only when executed directly
if (require.main === module) {
  bootstrap();
}