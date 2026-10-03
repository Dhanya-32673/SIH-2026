import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const rawCors = process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173';
  const allowedOrigins = rawCors.split(',').map((o) => o.trim()).filter(Boolean);

  // Enable CORS with origin callback to properly support credentials without wildcard *
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests without Origin (curl, server-to-server, health checks)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.amplifyapp.com') ||
        origin.endsWith('.pages.dev');

      if (isAllowed) {
        return callback(null, true);
      }
      // Permissive fallback reflecting origin
      return callback(null, true);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(` AI-POWERED PERSONAL HEALTH COMPANION - NESTJS BACKEND `);
  logger.log(`=======================================================`);
  logger.log(` HTTP REST Server running on: http://localhost:${port}`);
  logger.log(` Health Check Endpoint:       http://localhost:${port}/api/health-check`);
  logger.log(` WebSocket Gateway running on: ws://localhost:${port}/health`);
  logger.log(` Active Health & Sensor Simulation Pipeline: 1 Hz TICK`);
  logger.log(`=======================================================`);
}

bootstrap();
