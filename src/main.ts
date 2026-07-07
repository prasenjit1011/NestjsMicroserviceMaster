import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  const grpcUrl = process.env.GRPC_URL || '0.0.0.0:50051';

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'item',
      protoPath: join(__dirname, 'proto/item.proto'),
      url: grpcUrl,
    },
  });

  await app.startAllMicroservices();

  await app.listen(8080, '0.0.0.0');

  console.log('\n===========', new Date().toLocaleTimeString(), '===========\n');
  console.log('🌐 HTTP Server: http://0.0.0.0:8080');
  console.log(`🚀 gRPC Server : ${grpcUrl}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application');
  console.error(error);
  process.exit(1);
});