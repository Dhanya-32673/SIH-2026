import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { HealthModule } from '../health/health.module';
import { EnvironmentModule } from '../environment/environment.module';
import { RiskEngineModule } from '../risk-engine/risk-engine.module';
import { SimulationModule } from '../simulation/simulation.module';

@Module({
  imports: [HealthModule, EnvironmentModule, RiskEngineModule, SimulationModule],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
