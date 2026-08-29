import { Module, Global } from '@nestjs/common';
import { SensorSimulatorService } from './sensor-simulator.service';

@Global()
@Module({
  providers: [SensorSimulatorService],
  exports: [SensorSimulatorService],
})
export class SimulationModule {}
