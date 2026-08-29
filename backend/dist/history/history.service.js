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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
const health_service_1 = require("../health/health.service");
const environment_service_1 = require("../environment/environment.service");
const risk_engine_service_1 = require("../risk-engine/risk-engine.service");
const sensor_simulator_service_1 = require("../simulation/sensor-simulator.service");
let HistoryService = class HistoryService {
    constructor(healthService, envService, riskEngine, simulator) {
        this.healthService = healthService;
        this.envService = envService;
        this.riskEngine = riskEngine;
        this.simulator = simulator;
    }
    getHistory(points = 60) {
        const healthHistory = this.healthService.getHistory(points);
        const envHistory = this.envService.getHistory(points);
        const count = Math.max(healthHistory.length, envHistory.length);
        const dataPoints = [];
        const now = Date.now();
        const needed = Math.max(points, 30);
        for (let i = needed - 1; i >= 0; i--) {
            const timeOffset = now - i * 1000;
            const h = healthHistory[healthHistory.length - 1 - i] || this.healthService.getLatest();
            const e = envHistory[envHistory.length - 1 - i] || this.envService.getLatest();
            const hrVariance = Math.sin(i * 0.15) * 2;
            const tempVariance = Math.cos(i * 0.1) * 0.05;
            const risk = this.riskEngine.analyze({ ...h, heartRate: Math.round(h.heartRate + hrVariance) }, e, {
                acceleration: 1.0,
                orientation: 'Standing',
                fallDetected: false,
                inactivityTimer: 0,
            });
            dataPoints.push({
                timestamp: new Date(timeOffset).toISOString(),
                heartRate: Math.round(h.heartRate + hrVariance),
                spo2: h.spo2,
                bodyTemperature: Number((h.bodyTemperature + tempVariance).toFixed(1)),
                envTemperature: e.temperature,
                humidity: e.humidity,
                aqi: e.airQuality.aqi,
                riskScore: risk.riskScore,
                status: risk.status,
            });
        }
        return {
            success: true,
            points: dataPoints.length,
            data: dataPoints,
        };
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_service_1.HealthService,
        environment_service_1.EnvironmentService,
        risk_engine_service_1.RiskEngineService,
        sensor_simulator_service_1.SensorSimulatorService])
], HistoryService);
//# sourceMappingURL=history.service.js.map