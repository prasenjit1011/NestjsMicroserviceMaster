import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { msg: string; time: string } {
    return {
      msg: 'Hello World! This is a NestJS microservice application.',
      time: (new Date()).toLocaleTimeString()
    }
  }
}
