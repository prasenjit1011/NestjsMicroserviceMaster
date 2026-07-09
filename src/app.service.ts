import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  private prisma = new PrismaClient();
  async getHello() {

    const data = await this.prisma.order.findMany({
      orderBy: {
        id: 'asc',
      },
    });


    return {
      message: 'Hello World From Order 175 Service!',
    };
  }
}