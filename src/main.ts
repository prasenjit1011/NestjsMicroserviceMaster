import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GrpcExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('NestJS Microservice API')
    .setDescription('REST API Gateway for gRPC Item Service')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Item CRUD')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3001);

  console.log(
    `API Gateway running at http://localhost:${process.env.PORT || 3001}`,
  );
}

bootstrap();