//  user/user.module.ts

import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { AdminService } from '../admin/admin.service';

@Module({
  controllers: [UserController],
  providers: [AdminService],
})
export class UserModule {}