import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Hello World From Order Service!',
    };
  }

  async getData(){
    return {res:"order Data", data:[{id:1, title:"demo"},{id:2,title:"dummy"}]};

    // return await this.prisma.order.findMany({
    //   orderBy: {
    //     id: 'asc',
    //   },
    // });
  }

}