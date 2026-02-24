import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Handler, Context, Callback } from 'aws-lambda';
import { configure as serverlessExpress } from '@vendia/serverless-express';

const expressApp = express();

// Immediately initialize the app and cache the server handler
const bootstrap = async (): Promise<Handler> => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await app.init();
  return serverlessExpress({ app: expressApp });
};

const cachedServerPromise = bootstrap();

// Lambda handler using pre-initialized promise to reduce cold starts
export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  const server = await cachedServerPromise;
  return server(event, context, callback);
};
