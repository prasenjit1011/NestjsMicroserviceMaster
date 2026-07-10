import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { GRPC } from '../common/constants';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: GRPC.ITEM_CLIENT,
        transport: Transport.GRPC,
        options: {
          url: GRPC.ITEM_URL,
          package: GRPC.ITEM_PACKAGE,
          protoPath: GRPC.ITEM_PROTO_PATH,
          credentials: ChannelCredentials.createSsl(),
        },
      },
      {
        name: 'ARTICLE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'article',
          protoPath: join(__dirname, 'proto/article.proto'),
          url: 'dns:///ecom-article-service-334684044157.asia-south1.run.app:443',
          credentials: ChannelCredentials.createSsl(),
        },
      }
    ]),
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}