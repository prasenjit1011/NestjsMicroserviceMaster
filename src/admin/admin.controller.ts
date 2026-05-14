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
import * as bcrypt from 'bcrypt';


@Controller('admins')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(
    private adminService: AdminService,
  ) {}

  @Get()
  @Render('admin-list')
  adminList(@Req() req) {
    const users = this.adminService.getUsers();
    const admins = users.filter(
      (x) => x.role !== 'superadmin',
    );


    return {
      users,
      admins,
      user: req.session.user,
    };
  }


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
  async add(@Body() body, @Res() res) {
    const users =  this.adminService.getUsers();
    const hashedPassword = await bcrypt.hash(body.password, 10);


    users.push({
      id: Date.now(),
      name: body.name,
      username: body.username,
      password: hashedPassword,
      role: 'admin',
      tenantId: body.tenantId,
    });

    this.adminService.saveUsers(users);

    return res.redirect('/admins');
  }
}