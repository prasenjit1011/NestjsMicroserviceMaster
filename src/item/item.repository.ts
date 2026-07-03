import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  create(data: Prisma.ItemCreateInput) {
    return this.prisma.item.create({
      data,
    });
  }

  // FIND ALL
  findAll() {
    return this.prisma.item.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  // FIND ONE
  findOne(id: number) {
    return this.prisma.item.findUnique({
      where: { id },
    });
  }

  // UPDATE
  update(id: number, data: Prisma.ItemUpdateInput) {
    return this.prisma.item.update({
      where: { id },
      data,
    });
  }

  // DELETE
  delete(id: number) {
    return this.prisma.item.delete({
      where: { id },
    });
  }
}