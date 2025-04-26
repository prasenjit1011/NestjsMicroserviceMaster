import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
//import { AppService } from './app.service';

async function bootstrap() {
  // Create the main app (HTTP server)
  const app = await NestFactory.create(AppModule);

  // Connect RabbitMQ as a microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'test_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  // Start the microservice
  await app.startAllMicroservices();
  console.log('✅ RabbitMQ subscriber is running...');

  // Start the HTTP server
  await app.listen(3000); //3001
  console.log('🚀 App is listening on port 3000');
}

bootstrap();

