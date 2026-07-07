import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Hello World From Item Service!',
    };
  }

  async getData(){
    return {res:"item Data", data:[{id:1, title:"demo"},{id:2,title:"dummy"}]};

    // return await this.prisma.item.findMany({
    //   orderBy: {
    //     id: 'asc',
    //   },
    // });
  }

}