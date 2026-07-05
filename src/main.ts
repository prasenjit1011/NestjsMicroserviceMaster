import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const grpcUrl = process.env.GRPC_URL || '0.0.0.0:50051';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'app',
        protoPath: join(__dirname, 'proto/app.proto'),
        url: grpcUrl,
      },
    },
  );

  await app.listen();

  console.log(`🚀 gRPC Microservice is running on ${grpcUrl}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start gRPC Microservice');
  console.error(error);
  process.exit(1);
});