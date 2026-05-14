import { Module } from '@nestjs/common';

import { AuthController } from './auth/auth.controller';

import { AdminModule } from './admn/admin.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AdminModule,
    ProductModule,
    UserModule,
  ],
  controllers: [AuthController],
})
export class AppModule {}