import * as dotenv from 'dotenv';
dotenv.config();

import {
  Module,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ProductsModule } from './products/products.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
    ProductsModule, 
    AuthModule
  ],
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