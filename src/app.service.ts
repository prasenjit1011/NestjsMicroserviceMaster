import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  private prisma = new PrismaClient();
  async getHello() {

    await this.prisma.article.create({
      data:{
        content:'Loren Ipsum txt '+ (new Date()).toLocaleTimeString()
      }
    });

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

  async getAricle(){
    const data = await this.prisma.article.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return data;
  }

}