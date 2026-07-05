import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, Prisma } from '../../generated/prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.OrderCreateInput) {
    const orderdata = await this.prisma.order.create({
      data,
      include: {
        items: true,
      },
    });

    return orderdata;
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

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });
  }

  async updateStatus(id: number, status: OrderStatus) {
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

  async delete(id: number) {
    return this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}