import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS MongoDB API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('Home')
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