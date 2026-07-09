import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Gateway')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);


  // ----------------------------------
  // Log every HTTP request
  // ----------------------------------
  app.use((req, res, next) => {
    const start = Date.now();

    console.log(`➡️  ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(`⬅️  ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });

    next();
  });


  const port = Number(process.env.PORT || 3000);

  await app.listen(port, '0.0.0.0');

  logger.log(`Gateway started successfully`);
  logger.log(`Listening on port ${port}`);
}


// ----------------------------------
// Global Error Handlers
// ----------------------------------
process.on('uncaughtException', (err) => {
  console.error('========================================');
  console.error('UNCAUGHT EXCEPTION');
  console.error(err);
  console.error('========================================');
});

process.on('unhandledRejection', (reason) => {
  console.error('========================================');
  console.error('UNHANDLED PROMISE REJECTION');
  console.error(reason);
  console.error('========================================');
});




bootstrap().catch((err) => {
  console.error('Bootstrap Error');
  console.error(err);
  process.exit(1);
});