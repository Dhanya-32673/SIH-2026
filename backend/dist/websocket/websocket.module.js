"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketModule = void 0;
const common_1 = require("@nestjs/common");
const health_gateway_1 = require("./health.gateway");
const simulation_module_1 = require("../simulation/simulation.module");
const risk_engine_module_1 = require("../risk-engine/risk-engine.module");
const alerts_module_1 = require("../alerts/alerts.module");
const emergency_module_1 = require("../emergency/emergency.module");
const health_module_1 = require("../health/health.module");
const environment_module_1 = require("../environment/environment.module");
let WebsocketModule = class WebsocketModule {
};
exports.WebsocketModule = WebsocketModule;
exports.WebsocketModule = WebsocketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            simulation_module_1.SimulationModule,
            risk_engine_module_1.RiskEngineModule,
            alerts_module_1.AlertsModule,
            emergency_module_1.EmergencyModule,
            health_module_1.HealthModule,
            environment_module_1.EnvironmentModule,
        ],
        providers: [health_gateway_1.HealthGateway],
        exports: [health_gateway_1.HealthGateway],
    })
], WebsocketModule);
//# sourceMappingURL=websocket.module.js.map