import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS MongoDB API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('Home')
    .addTag('Auth')
    .addTag('Brand CRUD')
    .addBearerAuth()    
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);

  console.log(`Application: http://localhost:3000`);
  console.log(`Swagger: http://localhost:3000/api-docs`);
}

bootstrap();