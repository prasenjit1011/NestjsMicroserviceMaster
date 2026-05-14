import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as path from 'path';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  // session
  app.use(
    session({
      secret: 'mysecretkey',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // static files
  app.useStaticAssets(path.join(process.cwd(), 'public'));

  // views
  app.setBaseViewsDir(path.join(process.cwd(), 'src/views'));
  app.setViewEngine('ejs');

  await app.listen(3000);
}

bootstrap();