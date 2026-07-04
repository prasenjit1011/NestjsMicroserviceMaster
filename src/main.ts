import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // -----------------------------
  // gRPC Microservice (Order)
  // -----------------------------
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.ORDER_GRPC_URL || '0.0.0.0:50051',
      package: 'order',
      protoPath: join(process.cwd(), 'src/grpc/order.proto'),
    },
  });

  await app.startAllMicroservices();

  // -----------------------------
  // Cloud Run health endpoint
  // -----------------------------
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');

  console.log(`Order service running on ${port}`);
}

bootstrap();