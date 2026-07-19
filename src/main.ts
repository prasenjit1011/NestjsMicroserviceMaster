import 'dotenv/config';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.GRPC,
        options: {
          url: process.env.ITEM_GRPC_URL || '127.0.0.1:50041',
          package: 'item',
          protoPath: join(process.cwd(), 'common-proto/proto/item.proto'),
        },
      },
    );

  await app.listen();

  console.log('\n\n========================');
  console.log(
    `Item gRPC Service running at ${
      process.env.ITEM_GRPC_URL || '127.0.0.1:50041'
    }`,
  );
}

bootstrap();
