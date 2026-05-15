// auth/auth.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from './auth.guard';

@Controller()
export class AuthController {
  private filePath = path.join(
    process.cwd(),
    'src/public',
    'user.json',
  );

  @Get('/')
  @Render('login')
  loginPage(@Req() req, @Res() res) {
    if (req.session?.user) {
      return res.redirect('/dashboard');
    }

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
  @UseGuards(AuthGuard)
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