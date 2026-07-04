import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @GrpcMethod('OrderService', 'CreateOrder')
  create(data: CreateOrderDto) {
    return this.orderService.create(data);
  }

  @GrpcMethod('OrderService', 'GetOrders')
  findAll(data: {
    page: number;
    limit: number;
  }) {
    return this.orderService.findAll(
      data.page,
      data.limit,
    );
  }

  @GrpcMethod('OrderService', 'GetOrderById')
  findOne(data: { id: number }) {
    return this.orderService.findOne(data.id);
  }

  @GrpcMethod('OrderService', 'UpdateOrderStatus')
  update(data: UpdateOrderDto) {
    return this.orderService.updateStatus(data);
  }

  @GrpcMethod('OrderService', 'DeleteOrder')
  delete(data: { id: number }) {
    return this.orderService.delete(data.id);
  }
}