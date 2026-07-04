import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  OrderStatus,
  Prisma,
} from '../../generated/prisma/client';

import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
  ) {}

  async create(dto: CreateOrderDto) {
    try {
      const total = dto.items.reduce(
        (sum, item) => sum + item.qty * item.price,
        0,
      );

      const order = await this.orderRepository.create({
        userId: dto.userId,
        total,
        items: {
          create: dto.items,
        },
      });

      return {
        success: true,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const result = await this.orderRepository.findAll(
      skip,
      limit,
    );

    return {
      success: true,
      message: 'Orders fetched successfully',
      data: result.data,
      total: result.total,
    };
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne(id);

    if (!order) {
      throw new NotFoundException(
        `Order ${id} not found`,
      );
    }

    return {
      success: true,
      data: order,
    };
  }

  async updateStatus(dto: UpdateOrderDto) {
    await this.findOne(dto.id);

    return this.orderRepository.updateStatus(
      dto.id,
      dto.status as OrderStatus,
    );
  }

  async delete(id: number) {
    await this.findOne(id);

    await this.orderRepository.delete(id);

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message,
      });
    }

    throw new RpcException({
      code: status.INTERNAL,
      message: 'Internal server error',
    });
  }
}