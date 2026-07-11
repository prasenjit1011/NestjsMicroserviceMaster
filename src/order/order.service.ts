import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, OrderStatus } from '@prisma/client';
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

  /**
   * Map Prisma Order -> Proto Order
   */
  private mapOrder(order: any) {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: Number(order.total),

      items:
        order.items?.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          qty: item.qty,
          price: Number(item.price),
        })) ?? [],
    };
  }



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
          create: dto.items.map(({ id, ...item }) => item),
        },
      });

      return {
        success: true,
        message: 'Order created successfully',
        data: this.mapOrder(order),
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const result = await this.orderRepository.findAll(
        skip,
        limit,
      );

      return {
        success: true,
        message: 'Orders fetched successfully at '+(new Date()).toLocaleDateString(),
        data: result.data.map((order) =>
          this.mapOrder(order),
        ),
        total: result.total,
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findOne(id: number) {
    try {
      const order =
        await this.orderRepository.findOne(id);

      if (!order) {
        throw new NotFoundException(
          `Order ${id} not found`,
        );
      }

      return {
        success: true,
        message: 'Order fetched successfully',
        data: this.mapOrder(order),
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateStatus(dto: UpdateOrderDto) {
    try {
      const exists =
        await this.orderRepository.findOne(dto.id);

      if (!exists) {
        throw new NotFoundException(
          `Order ${dto.id} not found`,
        );
      }

      const order =
        await this.orderRepository.updateStatus(
          dto.id,
          dto.status as OrderStatus,
        );

      return {
        success: true,
        message: 'Order updated successfully',
        data: this.mapOrder(order),
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: number) {
    try {
      const exists =
        await this.orderRepository.findOne(id);

      if (!exists) {
        throw new NotFoundException(
          `Order ${id} not found`,
        );
      }

      await this.orderRepository.delete(id);

      return {
        success: true,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof NotFoundException) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: error.message,
      });
    }

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