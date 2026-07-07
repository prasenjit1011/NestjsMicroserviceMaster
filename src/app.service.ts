import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {

  constructor(private readonly prisma: PrismaService) {}

  getHello() {
    return {
      message: 'Hello World From New Item Service!',
    };
  }

  async getData(){
    // return {res:"item Data", data:[{id:1, title:"demo"},{id:2,title:"dummy"}]};

    return await this.prisma.item.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}