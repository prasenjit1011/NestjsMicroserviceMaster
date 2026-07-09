import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return {
      status: 'Dummy World- Restart Health Check '+ new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    };
  }

  @Get('/dummy')
  getDummy(){
    return {
      status: 'Dummy New World-Health Check '+ new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    };
  }
}