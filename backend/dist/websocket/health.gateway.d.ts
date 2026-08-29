import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SensorSimulatorService } from '../simulation/sensor-simulator.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { AlertsService } from '../alerts/alerts.service';
import { EmergencyService } from '../emergency/emergency.service';
import { HealthService } from '../health/health.service';
import { EnvironmentService } from '../environment/environment.service';
import { DemoScenario, DisasterMode } from '../common/interfaces/telemetry.interface';
export declare class HealthGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly simulator;
    private readonly riskEngine;
    private readonly alertsService;
    private readonly emergencyService;
    private readonly healthService;
    private readonly envService;
    server: Server;
    private readonly logger;
    private timer;
    private tickCounter;
    constructor(simulator: SensorSimulatorService, riskEngine: RiskEngineService, alertsService: AlertsService, emergencyService: EmergencyService, healthService: HealthService, envService: EnvironmentService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    private startStreamingLoop;
    private generateCurrentPayload;
    handleSetScenario(data: {
        scenario: DemoScenario;
    }, client: Socket): {
        success: boolean;
        scenario: DemoScenario;
    };
    handleSetDisasterMode(data: {
        mode: DisasterMode;
    }, client: Socket): {
        success: boolean;
        mode: DisasterMode;
    };
    handleEmergencyResponse(data: {
        action: 'SAFE' | 'NEED_HELP';
    }): Promise<{
        success: boolean;
        message: string;
        state: string;
        emergency?: undefined;
    } | {
        success: boolean;
        message: string;
        emergency: {
            id: string;
            userId: string;
            riskType: string;
            state: "DETECTED" | "COUNTDOWN" | "USER_CONFIRMED_SAFE" | "ESCALATED";
            countdownRemaining: number;
            triggerFactors: string[];
            simulatedLocation: {
                latitude: number;
                longitude: number;
                accuracy: string;
                label: string;
            };
            triggeredAt: Date;
            resolvedAt?: Date;
            escalatedAt?: Date;
        };
        state?: undefined;
    }>;
    handleAcknowledgeAlert(data: {
        id: string;
    }): Promise<{
        success: boolean;
        id: string;
    }>;
}
