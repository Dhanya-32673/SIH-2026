"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var HealthGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const sensor_simulator_service_1 = require("../simulation/sensor-simulator.service");
const risk_engine_service_1 = require("../risk-engine/risk-engine.service");
const alerts_service_1 = require("../alerts/alerts.service");
const emergency_service_1 = require("../emergency/emergency.service");
const health_service_1 = require("../health/health.service");
const environment_service_1 = require("../environment/environment.service");
let HealthGateway = HealthGateway_1 = class HealthGateway {
    constructor(simulator, riskEngine, alertsService, emergencyService, healthService, envService) {
        this.simulator = simulator;
        this.riskEngine = riskEngine;
        this.alertsService = alertsService;
        this.emergencyService = emergencyService;
        this.healthService = healthService;
        this.envService = envService;
        this.logger = new common_1.Logger(HealthGateway_1.name);
        this.timer = null;
        this.tickCounter = 0;
    }
    afterInit(server) {
        this.logger.log('HealthGateway Socket.IO initialized on namespace /health');
        this.startStreamingLoop();
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        const tick = this.generateCurrentPayload();
        client.emit('telemetry', tick);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    startStreamingLoop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(async () => {
            try {
                const payload = this.generateCurrentPayload();
                this.tickCounter++;
                this.healthService.updateLatest(payload.health);
                this.envService.updateLatest(payload.environment);
                if (this.tickCounter % 5 === 0) {
                    this.healthService.persistReading(payload.health, payload.userId);
                    this.envService.persistReading(payload.environment, payload.userId);
                }
                const newAlert = await this.alertsService.evaluateAndCreateAlert(payload.userId, payload.risk);
                if (newAlert) {
                    this.server.emit('alert', newAlert);
                }
                if (payload.risk.status === 'CRITICAL' || payload.motion.fallDetected) {
                    const emergency = this.emergencyService.triggerEmergency(payload.userId, payload.risk);
                    if (emergency) {
                        this.emergencyService.decrementCountdown();
                        this.server.emit('emergency', emergency);
                    }
                }
                else {
                    const activeEmerg = this.emergencyService.getActiveEmergency();
                    if (activeEmerg && activeEmerg.state === 'COUNTDOWN') {
                        this.emergencyService.decrementCountdown();
                        this.server.emit('emergency', activeEmerg);
                    }
                }
                this.server.emit('telemetry', payload);
            }
            catch (err) {
                this.logger.error(`Error in streaming tick loop: ${err.message}`);
            }
        }, 1000);
    }
    generateCurrentPayload() {
        const rawTick = this.simulator.generateNextTick();
        const scenario = this.simulator.getScenario();
        const disasterMode = this.simulator.getDisasterMode();
        const risk = this.riskEngine.analyze(rawTick.health, rawTick.environment, rawTick.motion, disasterMode);
        return {
            timestamp: new Date().toISOString(),
            userId: 'demo_user_anonymous',
            scenario,
            disasterMode,
            health: rawTick.health,
            environment: rawTick.environment,
            motion: rawTick.motion,
            risk,
            batteryLevel: 94,
            deviceStatus: risk.status === 'CRITICAL' ? 'EMERGENCY' : 'ONLINE',
        };
    }
    handleSetScenario(data, client) {
        if (data?.scenario) {
            this.simulator.setScenario(data.scenario);
            const immediatePayload = this.generateCurrentPayload();
            this.server.emit('telemetry', immediatePayload);
            return { success: true, scenario: data.scenario };
        }
    }
    handleSetDisasterMode(data, client) {
        if (data?.mode) {
            this.simulator.setDisasterMode(data.mode);
            const immediatePayload = this.generateCurrentPayload();
            this.server.emit('telemetry', immediatePayload);
            return { success: true, mode: data.mode };
        }
    }
    async handleEmergencyResponse(data) {
        const result = await this.emergencyService.respondToEmergency(data.action);
        this.server.emit('emergency', result.emergency || null);
        return result;
    }
    async handleAcknowledgeAlert(data) {
        if (data?.id) {
            await this.alertsService.acknowledgeAlert(data.id);
            this.server.emit('alert_acknowledged', { id: data.id });
            return { success: true, id: data.id };
        }
    }
};
exports.HealthGateway = HealthGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], HealthGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('set_scenario'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], HealthGateway.prototype, "handleSetScenario", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('set_disaster_mode'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], HealthGateway.prototype, "handleSetDisasterMode", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('emergency_response'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthGateway.prototype, "handleEmergencyResponse", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('acknowledge_alert'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthGateway.prototype, "handleAcknowledgeAlert", null);
exports.HealthGateway = HealthGateway = HealthGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/health',
        cors: {
            origin: '*',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [sensor_simulator_service_1.SensorSimulatorService,
        risk_engine_service_1.RiskEngineService,
        alerts_service_1.AlertsService,
        emergency_service_1.EmergencyService,
        health_service_1.HealthService,
        environment_service_1.EnvironmentService])
], HealthGateway);
//# sourceMappingURL=health.gateway.js.map