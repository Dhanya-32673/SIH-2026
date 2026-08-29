import { Controller, Get } from '@nestjs/common';
import { RiskEngineService } from './risk-engine.service';
import { HealthService } from '../health/health.service';
import { EnvironmentService } from '../environment/environment.service';
import { SensorSimulatorService } from '../simulation/sensor-simulator.service';

@Controller('api/risk')
export class RiskController {
  constructor(
    private readonly riskEngine: RiskEngineService,
    private readonly healthService: HealthService,
    private readonly envService: EnvironmentService,
    private readonly simulator: SensorSimulatorService,
  ) {}

  @Get('current')
  getCurrentRisk() {
    const health = this.healthService.getLatest();
    const env = this.envService.getLatest();
    const tick = this.simulator.generateNextTick();
    const risk = this.riskEngine.analyze(
      health,
      env,
      tick.motion,
      this.simulator.getDisasterMode(),
    );
    return {
      success: true,
      data: risk,
    };
  }
}
