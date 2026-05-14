// admin/admin.controller.ts
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

import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('admins')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(
    private adminService: AdminService,
  ) {}

  @Get()
  @Render('admin-list')
  adminList(@Req() req) {

    const admins = [
      {
        id: 1,
        username: 'admin1',
        email: 'admin1@gmail.com',
        role: 'admin',
        tenantName: 'Tenant 1',
      },
    ];

    const users = this.adminService.getUsers();
    // const admins = users.filter(
    //   (x) => x.role === 'admin',
    // );

    console.log('',users);

    return {
      users,
      admins,
      user: req.session.user,
    };
  }


  // list() {


  //   return { admins };
  // }



  @Get('/add')
  @Render('admin-add')
  addAdminPage() {
    const tenants = [
      {
        tenantId: 1,
        name: 'Tenant 1',
      },
      {
        tenantId: 2,
        name: 'Tenant 2',
      },
    ];

    return {
      tenants,
    };
  }

  @Post('/add')
  add(@Body() body, @Res() res) {
    const users =
      this.adminService.getUsers();

    users.push({
      id: Date.now(),
      username: body.username,
      password: body.password,
      role: 'admin',
    });

    this.adminService.saveUsers(users);

    return res.redirect('/admins');
  }
}