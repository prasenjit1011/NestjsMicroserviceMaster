import 'dotenv/config';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = Number(process.env.PORT) || 8080;
  const app =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.GRPC,
        options: {
          url: `0.0.0.0:${port}`,
          package: 'item',
          protoPath: join(__dirname, 'grpc/item.proto'),
        },
      },
    );

  await app.listen();

  console.log(`🚀 gRPC Item Service listening on ${port}`);
}

bootstrap();