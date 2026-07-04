import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'your_package',
      protoPath: 'src/proto/your.proto',
      url: '0.0.0.0:50051',
    },
  });

  await app.startAllMicroservices();

  // 🔥 REQUIRED for Cloud Run health check
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');

  console.log(`HTTP server running on ${port}`);
  console.log('gRPC microservice running on 50051');
}

bootstrap();