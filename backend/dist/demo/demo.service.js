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
var DemoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoService = void 0;
const common_1 = require("@nestjs/common");
const sensor_simulator_service_1 = require("../simulation/sensor-simulator.service");
let DemoService = DemoService_1 = class DemoService {
    constructor(simulator) {
        this.simulator = simulator;
        this.logger = new common_1.Logger(DemoService_1.name);
    }
    setScenario(scenario) {
        this.simulator.setScenario(scenario);
        return {
            success: true,
            currentScenario: this.simulator.getScenario(),
            message: `Simulation scenario transitioned to: ${scenario}`,
        };
    }
    setDisasterMode(mode) {
        this.simulator.setDisasterMode(mode);
        return {
            success: true,
            currentDisasterMode: this.simulator.getDisasterMode(),
            message: `Disaster mode set to: ${mode}`,
        };
    }
    getCurrentStatus() {
        return {
            success: true,
            scenario: this.simulator.getScenario(),
            disasterMode: this.simulator.getDisasterMode(),
            availableScenarios: ['NORMAL', 'HEAT_STRESS', 'POLLUTION', 'FALL', 'CRITICAL'],
            availableDisasterModes: ['NORMAL', 'HEAT_WAVE', 'POLLUTION', 'DISASTER'],
        };
    }
};
exports.DemoService = DemoService;
exports.DemoService = DemoService = DemoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sensor_simulator_service_1.SensorSimulatorService])
], DemoService);
//# sourceMappingURL=demo.service.js.map