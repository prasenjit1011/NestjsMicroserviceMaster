import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as googleProtoFiles from 'google-proto-files';

import { GRPC } from '../common/constants';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';

@Module({  
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
  ],
  exports: [
    OrderService,
  ],
})
export class OrderModule {}