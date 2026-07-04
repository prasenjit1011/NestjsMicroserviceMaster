import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as googleProtoFiles from 'google-proto-files';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.ORDER_GRPC_URL || '0.0.0.0:50052',
      package: 'order',
      protoPath: join(process.cwd(), 'src/grpc/order.proto'),
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [
          googleProtoFiles.getProtoPath(),
        ],
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');

  console.log(
    `Order service running at ${
      process.env.ORDER_GRPC_URL || '0.0.0.0:50052'
    }`,
  );
}

bootstrap();