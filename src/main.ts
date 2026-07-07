import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const port = Number(process.env.PORT || 8080);

  await app.listen(port, '0.0.0.0');

  console.log(`HTTP : ${port}`);
  console.log(`gRPC : ${grpcUrl}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application');
  console.error(error);
  process.exit(1);
});