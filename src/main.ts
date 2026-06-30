import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

export async function bootstrap() {
  console.clear();

  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS MongoDB API')
    .setDescription('API documentation for NestJS MongoDB project')
    .setVersion('1.0')
    .addTag('Home')
    .addTag('Auth')
    .addTag('Product CRUD')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name can be referenced in @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI available at: http://localhost:${port}/api-docs`);
}

// Run only when executed directly
if (require.main === module) {
  bootstrap();
}


// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { AppModule } from './app.module';

// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// export async function bootstrap() {
//   dotenv.config();

//   console.clear();

//   const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//     }),
//   );

//   await app.listen(process.env.PORT);

//   console.log('PORT : ', process.env.PORT);
// }

// // Run only when executed directly
// if (require.main === module) {
//   bootstrap();
// }
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const config = new DocumentBuilder()
//     .setTitle('NestJS MongoDB API')
//     .setDescription('API documentation')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, config);

//   SwaggerModule.setup('api-docs', app, document);

//   await app.listen(3000);

//   console.log(`Application: http://localhost:3000`);
//   console.log(`Swagger: http://localhost:3000/api-docs`);
// }

// bootstrap();
