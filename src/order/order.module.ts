import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as googleProtoFiles from 'google-proto-files';

import { GRPC } from '../common/constants';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: GRPC.ORDER_CLIENT,
        transport: Transport.GRPC,
        options: {
          url: GRPC.ORDER_URL,
          package: GRPC.ORDER_PACKAGE,
          protoPath: GRPC.ORDER_PROTO_PATH,

          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            includeDirs: [
              googleProtoFiles.getProtoPath(),
            ],
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}