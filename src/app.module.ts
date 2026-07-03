import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ItemModule } from './item/item.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

