import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('ItemService', 'GetHello')
  getHello() {
    return this.appService.getHello();
  }

  @Get('/getdata')
  getData(){
    return this.appService.getData();
  }
}