// lambda.ts or main.ts depending on how you've structured it
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import * as express from 'express';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  try {
    console.log('Starting NestJS application bootstrap...');
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);
    console.log('NestJS app created successfully');
    await app.init();
    console.log('NestJS app initialized successfully');
    return serverlessExpress({ app: expressApp });
  } catch (error) {
    console.error('Error during bootstrap:', error);
    throw error;
  }
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  try {
    console.log('Lambda handler invoked');
    console.log('Event path:', event.path || event.rawPath);
    cachedServer ??= await bootstrap();
    return cachedServer(event, context, callback);
  } catch (error) {
    console.error('Lambda handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
        stack: error.stack
      })
    };
  }
};
