import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Request, Response } from 'express';

const express = require('express');
const server = typeof express === 'function' ? express() : (express.default || express)();
let isAppInitialized = false;

async function bootstrapServerless() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  await app.init();
  isAppInitialized = true;
  return server;
}

export default async function handler(req: Request, res: Response) {
  try {
    if (!isAppInitialized) {
      await bootstrapServerless();
    }
    return server(req, res);
  } catch (error: any) {
    console.error('Serverless execution error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error during serverless execution',
        error: error?.message || String(error),
      });
    }
  }
}
