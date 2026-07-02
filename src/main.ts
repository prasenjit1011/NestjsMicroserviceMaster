import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS PostgreSQL API')
    .setDescription('NestJS + Prisma + PostgreSQL API')
    .setVersion('1.0')
    .addTag('Home')
    .addTag('Auth')
    .addTag('Brand CRUD')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  // Cloud Run provides PORT=8080
  const port = parseInt(process.env.PORT || '8080', 10);

  // Required for Cloud Run
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌐 http://localhost:${port}`);
  console.log(`📘 Swagger: http://localhost:${port}/api-docs`);
}

bootstrap().catch((err) => {
  console.error('Application failed to start');
  console.error(err);
  process.exit(1);
});