import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { SimulationModule } from './simulation/simulation.module';
import { RiskEngineModule } from './risk-engine/risk-engine.module';
import { HealthModule } from './health/health.module';
import { EnvironmentModule } from './environment/environment.module';
import { AlertsModule } from './alerts/alerts.module';
import { EmergencyModule } from './emergency/emergency.module';
import { DemoModule } from './demo/demo.module';
import { WebsocketModule } from './websocket/websocket.module';
import { HistoryModule } from './history/history.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    DatabaseModule,
    SimulationModule,
    RiskEngineModule,
    HealthModule,
    EnvironmentModule,
    AlertsModule,
    EmergencyModule,
    DemoModule,
    WebsocketModule,
    HistoryModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
