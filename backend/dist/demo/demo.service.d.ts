import { SensorSimulatorService } from '../simulation/sensor-simulator.service';
import { DemoScenario, DisasterMode } from '../common/interfaces/telemetry.interface';
export declare class DemoService {
    private readonly simulator;
    private readonly logger;
    constructor(simulator: SensorSimulatorService);
    setScenario(scenario: DemoScenario): {
        success: boolean;
        currentScenario: DemoScenario;
        message: string;
    };
    setDisasterMode(mode: DisasterMode): {
        success: boolean;
        currentDisasterMode: DisasterMode;
        message: string;
    };
    getCurrentStatus(): {
        success: boolean;
        scenario: DemoScenario;
        disasterMode: DisasterMode;
        availableScenarios: string[];
        availableDisasterModes: string[];
    };
}
