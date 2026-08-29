"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskEngineModule = void 0;
const common_1 = require("@nestjs/common");
const risk_engine_service_1 = require("./risk-engine.service");
const risk_controller_1 = require("./risk.controller");
const health_module_1 = require("../health/health.module");
const environment_module_1 = require("../environment/environment.module");
const simulation_module_1 = require("../simulation/simulation.module");
let RiskEngineModule = class RiskEngineModule {
};
exports.RiskEngineModule = RiskEngineModule;
exports.RiskEngineModule = RiskEngineModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => health_module_1.HealthModule),
            (0, common_1.forwardRef)(() => environment_module_1.EnvironmentModule),
            (0, common_1.forwardRef)(() => simulation_module_1.SimulationModule),
        ],
        controllers: [risk_controller_1.RiskController],
        providers: [risk_engine_service_1.RiskEngineService],
        exports: [risk_engine_service_1.RiskEngineService],
    })
], RiskEngineModule);
//# sourceMappingURL=risk-engine.module.js.map