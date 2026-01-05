// src/demat/demat.module.ts
import { Module } from '@nestjs/common';
import { DematController } from './demat.controller';
import { DematService } from './demat.service';

@Module({
  controllers: [DematController],
  providers: [DematService],
  exports: [DematService],
})
export class DematModule {}
