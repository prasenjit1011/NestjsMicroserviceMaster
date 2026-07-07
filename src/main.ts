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


  const server = app.getHttpServer();
  console.log(server.address());
  console.log(`HTTP : ${port}`);
  console.log(`gRPC : ${grpcUrl}`);
}


process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT');
  console.error(err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED');
  console.error(err);
});

bootstrap().catch((err) => {
  console.error('BOOTSTRAP ERROR');
  console.error(err);
  process.exit(1234);
});