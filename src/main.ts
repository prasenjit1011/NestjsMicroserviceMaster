import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);

  console.log(`Application: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api-docs`);
}

bootstrap();