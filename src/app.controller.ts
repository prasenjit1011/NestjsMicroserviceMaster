import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return {
      status: 'Dummy World-Health Check '+ new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    };
  }
}