// main.local.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT);

    console.clear()
    console.log(`🚀 App successfully running on http://localhost:${process.env.PORT}`);
}
bootstrap();
