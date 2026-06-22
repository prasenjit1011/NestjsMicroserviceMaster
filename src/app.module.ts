import {
  Module,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';

import { ProductsModule } from './products/products.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule
  implements NestModule
{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}