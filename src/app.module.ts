import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ChannelCredentials } from '@grpc/grpc-js';

import { AppController } from './app.controller';
import { ItemController } from './item/item.controller';
import { ItemService } from './item/item.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ITEM_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'item',
          protoPath: join(__dirname, '../proto/item.proto'),
          url: 'dns:///item-service-334684044157.asia-south1.run.app:443',
          credentials: ChannelCredentials.createSsl(),
        },
      },
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: join(__dirname, '../proto/order.proto'),
          url: 'dns:///order-service-334684044157.asia-south1.run.app:443',
          credentials: ChannelCredentials.createSsl(),
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    ItemController,
    OrderController
  ],
  providers: [ItemService, OrderService],
})
export class AppModule {}