import 'dotenv/config';
import serverlessExpress from '@codegenie/serverless-express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

// ---------------------------------------------------------------------------
// Lambda handler (lazy-initialised, cached after first cold start)
// ---------------------------------------------------------------------------
let cachedServer: any;

async function bootstrapLambda() {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });
  await app.init();
  return serverlessExpress({ app: expressApp });
}

export const handler = async (event: any, context: any, callback: any) => {
  if (!cachedServer) {
    cachedServer = await bootstrapLambda();
  }
  return cachedServer(event, context, callback);
};

// ---------------------------------------------------------------------------
// Local dev server (skipped when running inside AWS Lambda)
// ---------------------------------------------------------------------------
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Authorization', 'Content-Type'],
    });

    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Sharpei API running on port ${port}`);
  }
  bootstrap();
}
