import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { getTemplatePath } from './utils/path.util';


@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/home')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/')
  async getTableView(@Res() res: Response) {
    const fs = require('fs');
    const path = require('path');
      // Read the HTML template
      const templatePath = getTemplatePath('profile.html');
      let html = fs.readFileSync(templatePath, 'utf8');
      res.send(html);
  }
}
