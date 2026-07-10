import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ChannelCredentials } from '@grpc/grpc-js';

import { AppController } from './app.controller';
import { ItemController } from './item/item.controller';
import { ItemService } from './item/item.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { ArticleController } from './article/article.controller';
import { ArticleService } from './article/article.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ARTICLE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'article',
          protoPath: join(__dirname, 'proto/article.proto'),
          url: 'dns:///ecom-article-service-334684044157.asia-south1.run.app:443',
          credentials: ChannelCredentials.createSsl(),
        },
      },
      {
        name: 'ITEM_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'item',
          protoPath: join(__dirname, 'proto/item.proto'),
          url: 'dns:///item-service-334684044157.asia-south1.run.app:443',
          credentials: ChannelCredentials.createSsl(),
        },
      },
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: join(__dirname, 'proto/order.proto'),
          url: 'dns:///item-order-service-334684044157.asia-south1.run.app:443',
          credentials: ChannelCredentials.createSsl(),
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    ArticleController,
    ItemController,
    OrderController
  ],
  providers: [ArticleService, ItemService, OrderService],
})
export class AppModule {}