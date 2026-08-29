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
exports.RiskController = void 0;
const common_1 = require("@nestjs/common");
const risk_engine_service_1 = require("./risk-engine.service");
const health_service_1 = require("../health/health.service");
const environment_service_1 = require("../environment/environment.service");
const sensor_simulator_service_1 = require("../simulation/sensor-simulator.service");
let RiskController = class RiskController {
    constructor(riskEngine, healthService, envService, simulator) {
        this.riskEngine = riskEngine;
        this.healthService = healthService;
        this.envService = envService;
        this.simulator = simulator;
    }
    getCurrentRisk() {
        const health = this.healthService.getLatest();
        const env = this.envService.getLatest();
        const tick = this.simulator.generateNextTick();
        const risk = this.riskEngine.analyze(health, env, tick.motion, this.simulator.getDisasterMode());
        return {
            success: true,
            data: risk,
        };
    }
};
exports.RiskController = RiskController;
__decorate([
    (0, common_1.Get)('current'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RiskController.prototype, "getCurrentRisk", null);
exports.RiskController = RiskController = __decorate([
    (0, common_1.Controller)('api/risk'),
    __metadata("design:paramtypes", [risk_engine_service_1.RiskEngineService,
        health_service_1.HealthService,
        environment_service_1.EnvironmentService,
        sensor_simulator_service_1.SensorSimulatorService])
], RiskController);
//# sourceMappingURL=risk.controller.js.map