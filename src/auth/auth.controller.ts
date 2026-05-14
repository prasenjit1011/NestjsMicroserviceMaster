// auth/auth.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
} from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AuthController {
  private filePath = path.join(
    process.cwd(),
    'public',
    'user.json',
  );

  @Get('/')
  @Render('login')
  loginPage() {
    return {
      error: null,
    };
  }

  @Post('/login')
  login(
    @Body() body,
    @Req() req,
    @Res() res,
  ) {
    const users = JSON.parse(
      fs.readFileSync(this.filePath, 'utf8'),
    );

    const user = users.find(
      (x) =>
        x.username === body.username &&
        x.password === body.password,
    );

    if (!user) {
      return res.send('Invalid Login');
    }

    req.session.user = user;

    return res.redirect('/dashboard');
  }

  @Get('/dashboard')
  @Render('dashboard')
  dashboard(@Req() req) {
    return {
      user: req.session.user,
    };
  }

  @Get('/logout')
  logout(@Req() req, @Res() res) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }
}