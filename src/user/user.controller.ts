//  user/user.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from '../admin/admin.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private adminService: AdminService,
  ) {}

  @Get()
  @Render('user-list')
  list() {
    const users =
      this.adminService.getUsers();

    const normalUsers = users.filter(
      (x) => x.role === 'user',
    );

    return {
      users: normalUsers,
    };
  }

  @Get('/add')
  @Render('user-add')
  addPage() {
    return {};
  }

  @Post('/add')
  add(@Body() body, @Res() res) {
    const users =
      this.adminService.getUsers();

    users.push({
      id: Date.now(),
      username: body.username,
      password: body.password,
      role: 'user',
    });

    this.adminService.saveUsers(users);

    return res.redirect('/users');
  }
}