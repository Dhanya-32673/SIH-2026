import { RiskEngineService } from './risk-engine.service';
import { HealthService } from '../health/health.service';
import { EnvironmentService } from '../environment/environment.service';
import { SensorSimulatorService } from '../simulation/sensor-simulator.service';
export declare class RiskController {
    private readonly riskEngine;
    private readonly healthService;
    private readonly envService;
    private readonly simulator;
    constructor(riskEngine: RiskEngineService, healthService: HealthService, envService: EnvironmentService, simulator: SensorSimulatorService);
    getCurrentRisk(): {
        success: boolean;
        data: import("../common/interfaces/telemetry.interface").IRiskAssessment;
    };
}
