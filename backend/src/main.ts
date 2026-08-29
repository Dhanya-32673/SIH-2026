import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend Vite dev server and general local clients
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
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
  logger.log(` WebSocket Gateway running on: ws://localhost:${port}/health`);
  logger.log(` Active Health & Sensor Simulation Pipeline: 1 Hz TICK`);
  logger.log(`=======================================================`);
}

bootstrap();
