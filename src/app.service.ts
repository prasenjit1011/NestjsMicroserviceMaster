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

    const encoded = Buffer.from(JSON.stringify(data)).toString('base64');

    return {
      message: encoded
    };
  }
}