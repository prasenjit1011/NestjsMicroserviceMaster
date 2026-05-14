import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as path from 'path';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // If deploying behind proxy (NGINX / ELB / Render / Railway)
  app.set('trust proxy', 1);

  // Cookie Parser
  app.use(cookieParser());

  // Session Config
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'mysecretkey',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: false, // change to true in production (HTTPS)
      },
    }),
  );

  // Static files
  app.useStaticAssets(path.join(process.cwd(), 'public'));

  // Views
  app.setBaseViewsDir(path.join(process.cwd(), 'views'));
  app.setViewEngine('ejs');

  await app.listen(3000);
}
bootstrap();