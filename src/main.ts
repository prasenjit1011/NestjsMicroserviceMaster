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
                url: process.env.ORDER_GRPC_URL || '127.0.0.1:50042',
                package: 'order',
                protoPath: join(process.cwd(), 'common-proto/proto/order.proto'),
              },
            },
          );

  await app.listen();

  console.log('\n\n========================');
  console.log(
    `Order gRPC Service running at ${
      process.env.ORDER_GRPC_URL || '127.0.0.1:50042'
    }`,
  );
}

bootstrap();
