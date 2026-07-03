import 'dotenv/config';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  const port = Number(process.env.PORT) || 8080;

  // -----------------------------------
  // 1. Create HTTP server (Cloud Run needs this)
  // -----------------------------------
  const app = await NestFactory.create(AppModule);

  // -----------------------------------
  // 2. Attach gRPC microservice
  // -----------------------------------
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051', // internal gRPC port
      package: 'item',
      protoPath: join(__dirname, 'grpc/item.proto'),
    },
  });

  // -----------------------------------
  // 3. Start all microservices (gRPC)
  // -----------------------------------
  await app.startAllMicroservices();

  // -----------------------------------
  // 4. Start HTTP server (Cloud Run health check)
  // -----------------------------------
  await app.listen(port);

  console.log(`🚀 HTTP server running on port ${port}`);
  console.log(`🚀 gRPC server running on port 50051`);
}

bootstrap();