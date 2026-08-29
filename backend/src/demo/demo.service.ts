import { Injectable, Logger } from '@nestjs/common';
import { SensorSimulatorService } from '../simulation/sensor-simulator.service';
import { DemoScenario, DisasterMode } from '../common/interfaces/telemetry.interface';

@Injectable()
export class DemoService {
  private readonly logger = new Logger(DemoService.name);

  constructor(private readonly simulator: SensorSimulatorService) {}

  public setScenario(scenario: DemoScenario) {
    this.simulator.setScenario(scenario);
    return {
      success: true,
      currentScenario: this.simulator.getScenario(),
      message: `Simulation scenario transitioned to: ${scenario}`,
    };
  }

  public setDisasterMode(mode: DisasterMode) {
    this.simulator.setDisasterMode(mode);
    return {
      success: true,
      currentDisasterMode: this.simulator.getDisasterMode(),
      message: `Disaster mode set to: ${mode}`,
    };
  }

  public getCurrentStatus() {
    return {
      success: true,
      scenario: this.simulator.getScenario(),
      disasterMode: this.simulator.getDisasterMode(),
      availableScenarios: ['NORMAL', 'HEAT_STRESS', 'POLLUTION', 'FALL', 'CRITICAL'],
      availableDisasterModes: ['NORMAL', 'HEAT_WAVE', 'POLLUTION', 'DISASTER'],
    };
  }
}
