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
import * as bcrypt from 'bcrypt';

@Controller()
export class AuthController {
  private filePath = path.join(
    process.cwd(),
    'src/public',
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
  async login(@Body() body, @Req() req, @Res() res) {
    const users = JSON.parse(
      fs.readFileSync(this.filePath, 'utf8'),
    );

    const user = users.find((val) =>  val.username === body.username);

    if (!user) {
      return res.send('User not found.');
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      return res.send('Invalid password.');
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