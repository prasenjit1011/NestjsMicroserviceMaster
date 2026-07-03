import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------------
  // CREATE
  // ------------------------
  create(data: Prisma.ItemCreateInput) {
    return this.prisma.item.create({
      data,
    });
  }

  // ------------------------
  // FIND ALL (PAGINATION FIXED)
  // ------------------------
  async findAll(skip: number, take: number, search: string) {
    const where: Prisma.ItemWhereInput = search
      ? {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.item.findMany({
        where,
        skip,
        take,
        orderBy: {
          id: 'asc',
        },
      }),

      this.prisma.item.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }

  // ------------------------
  // FIND ONE
  // ------------------------
  findOne(id: number) {
    return this.prisma.item.findUnique({
      where: { id },
    });
  }

  // ------------------------
  // UPDATE
  // ------------------------
  update(id: number, data: Prisma.ItemUpdateInput) {
    return this.prisma.item.update({
      where: { id },
      data,
    });
  }

  // ------------------------
  // DELETE
  // ------------------------
  delete(id: number) {
    return this.prisma.item.delete({
      where: { id },
    });
  }
}