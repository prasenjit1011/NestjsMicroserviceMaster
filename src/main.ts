import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('========================================');
  console.log('Starting NestJS Application...');
  console.log('========================================');

  const app = await NestFactory.create(AppModule);

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

  const grpcUrl = process.env.GRPC_URL || '0.0.0.0:50051';
  const port = Number(process.env.PORT || 8080);

 

  const protoPath = join(__dirname, '../proto/order.proto');

  console.log(protoPath);
  console.log(existsSync(protoPath));


  // ----------------------------------
  // Start gRPC Microservice
  // ----------------------------------
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'order',
      protoPath: join(__dirname, '../proto/order.proto'),
      url: grpcUrl,
    },
  });

  await app.startAllMicroservices();

  // ----------------------------------
  // Start HTTP Server
  // ----------------------------------
  await app.listen(port, '0.0.0.0');

  const server = app.getHttpServer();

  console.log('');
  console.log('========================================');
  console.log('NestJS Started Successfully');
  console.log('========================================');
  console.log('Server Address :', server.address());
  console.log(`HTTP Server    : http://0.0.0.0:${port}`);
  console.log(`gRPC Server    : ${grpcUrl}`);
  console.log(`NODE_ENV       : ${process.env.NODE_ENV}`);
  console.log('========================================');
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
  console.error('========================================');
  console.error('BOOTSTRAP ERROR');
  console.error(err);
  console.error('========================================');
  process.exit(1);
});