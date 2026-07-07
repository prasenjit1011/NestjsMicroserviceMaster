import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to Neon PostgreSQL');
    } catch (err) {
      console.error('❌ Failed to connect to Neon');
      console.error(err);
      throw err;
    }
  }
}