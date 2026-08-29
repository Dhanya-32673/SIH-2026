import { DemoScenario, DisasterMode, IEnvironmentMetrics, IHealthMetrics, IMotionMetrics } from '../common/interfaces/telemetry.interface';
export declare class SensorSimulatorService {
    private readonly logger;
    private currentScenario;
    private currentDisasterMode;
    private scenarioStepCount;
    private currentHR;
    private currentSpO2;
    private currentBodyTemp;
    private currentEnvTemp;
    private currentHumidity;
    private currentPressure;
    private currentAQI;
    private currentPM25;
    private currentAcceleration;
    private currentOrientation;
    private fallDetected;
    private inactivitySeconds;
    private readonly scenarioTargets;
    constructor();
    setScenario(scenario: DemoScenario): void;
    getScenario(): DemoScenario;
    setDisasterMode(mode: DisasterMode): void;
    getDisasterMode(): DisasterMode;
    generateNextTick(): {
        health: IHealthMetrics;
        environment: IEnvironmentMetrics;
        motion: IMotionMetrics;
    };
    private calculateHeatIndex;
    private generatePPGWave;
}
