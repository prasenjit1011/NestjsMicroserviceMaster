import {Controller, Get, Logger, Post, Put, Delete, Body, Param, } from '@nestjs/common';
import { OrderService } from './order.service';


@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(private readonly service: OrderService) {}

  @Get()
  getAll() {
    this.logger.log('GET /orders received');
    return this.service.getOrders();
  }

  /*@Get(':id')
  getOne(@Param('id') id: number) {
    return this.service.getOrder(+id);
  }

  @Post()
  create(@Body() dto: any) {
    return this.service.createOrder(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: any,
  ) {
    return this.service.updateOrder({
      id: +id,
      ...dto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.deleteOrder(+id);
  }*/
}