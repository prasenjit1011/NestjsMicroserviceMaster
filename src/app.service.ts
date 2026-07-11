import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! This is a NestJS microservice application. Trying to connect Order Service 904';
  }
}
