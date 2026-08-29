import { HealthService } from '../health/health.service';
import { EnvironmentService } from '../environment/environment.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { SensorSimulatorService } from '../simulation/sensor-simulator.service';
export declare class HistoryService {
    private readonly healthService;
    private readonly envService;
    private readonly riskEngine;
    private readonly simulator;
    constructor(healthService: HealthService, envService: EnvironmentService, riskEngine: RiskEngineService, simulator: SensorSimulatorService);
    getHistory(points?: number): {
        success: boolean;
        points: number;
        data: {
            timestamp: string;
            heartRate: number;
            spo2: number;
            bodyTemperature: number;
            envTemperature: number;
            humidity: number;
            aqi: number;
            riskScore: number;
            status: string;
        }[];
    };
}
