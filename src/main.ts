import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // HTTP Server
  const app = await NestFactory.create(AppModule);
  const grpcUrl = process.env.GRPC_URL || '0.0.0.0:50051';

  // gRPC Microservice
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'item',
      protoPath: join(__dirname, 'proto/item.proto'),
      url: grpcUrl,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('\n\n===========', new Date().toLocaleTimeString(),'===========\n')
  console.log('🌐 HTTP Server: http://localhost:3000');
  console.log('🚀 gRPC Server : 0.0.0.0:50051');
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start gRPC Microservice');
  console.error(error);
  process.exit(1);
});;