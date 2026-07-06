import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ChannelCredentials } from '@grpc/grpc-js';

import { ItemController } from './item/item.controller';
import { ItemService } from './item/item.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ITEM_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'app',
          protoPath: join(__dirname, 'proto/app.proto'),
          url: 'dns:///item-service-334684044157.asia-south1.run.app:443',
          credentials: ChannelCredentials.createSsl(),
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    ItemController
  ],
  providers: [ItemService],
})
export class AppModule {}