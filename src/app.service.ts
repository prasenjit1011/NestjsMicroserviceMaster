import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello() {


    const data = await this.prisma.order.findMany({
      orderBy: {
        id: 'asc',
      },
    });


    return {
      message: 'Hello World From Order 1225 Service!',
    };
  }
}