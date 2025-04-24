import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern('test_route')
  handleMessage(data: any) {
    console.log('📥 Received in nestjsmongo : ', data);
    return { ack: true };
  }
}

