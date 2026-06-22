import {
  Module,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';

import { ProductsModule } from './products/products.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [ProductsModule],
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