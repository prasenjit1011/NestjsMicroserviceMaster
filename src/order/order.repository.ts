import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, OrderStatus } from '../../generated/prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({
      data,
      include: {
        items: true,
      },
    });
  }

  async findAll(skip: number, take: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        skip,
        take,
        orderBy: {
          id: 'desc',
        },
        include: {
          items: true,
        },
      }),

      this.prisma.order.count(),
    ]);

    return {
      data,
      total,
    };
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });
  }

  updateStatus(id: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        items: true,
      },
    });
  }

  delete(id: number) {
    return this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}