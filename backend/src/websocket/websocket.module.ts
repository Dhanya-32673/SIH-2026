import { Module } from '@nestjs/common';
import { HealthGateway } from './health.gateway';
import { SimulationModule } from '../simulation/simulation.module';
import { RiskEngineModule } from '../risk-engine/risk-engine.module';
import { AlertsModule } from '../alerts/alerts.module';
import { EmergencyModule } from '../emergency/emergency.module';
import { HealthModule } from '../health/health.module';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [
    SimulationModule,
    RiskEngineModule,
    AlertsModule,
    EmergencyModule,
    HealthModule,
    EnvironmentModule,
  ],
  providers: [HealthGateway],
  exports: [HealthGateway],
})
export class WebsocketModule {}
