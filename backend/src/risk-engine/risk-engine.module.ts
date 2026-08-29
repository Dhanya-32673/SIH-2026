import { Module, Global, forwardRef } from '@nestjs/common';
import { RiskEngineService } from './risk-engine.service';
import { RiskController } from './risk.controller';
import { HealthModule } from '../health/health.module';
import { EnvironmentModule } from '../environment/environment.module';
import { SimulationModule } from '../simulation/simulation.module';

@Global()
@Module({
  imports: [
    forwardRef(() => HealthModule),
    forwardRef(() => EnvironmentModule),
    forwardRef(() => SimulationModule),
  ],
  controllers: [RiskController],
  providers: [RiskEngineService],
  exports: [RiskEngineService],
})
export class RiskEngineModule {}
