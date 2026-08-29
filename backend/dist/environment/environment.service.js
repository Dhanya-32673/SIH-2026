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
var EnvironmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const environment_reading_schema_1 = require("../database/schemas/environment-reading.schema");
let EnvironmentService = EnvironmentService_1 = class EnvironmentService {
    constructor(envModel) {
        this.envModel = envModel;
        this.logger = new common_1.Logger(EnvironmentService_1.name);
        this.latestMetrics = {
            temperature: 25.4,
            humidity: 48,
            pressure: 1013.2,
            airQuality: {
                aqi: 38,
                pm25: 12.4,
                status: 'GOOD',
            },
            heatIndex: 25.4,
        };
        this.historyBuffer = [];
    }
    updateLatest(metrics) {
        this.latestMetrics = metrics;
        this.historyBuffer.push({ ...metrics, timestamp: new Date() });
        if (this.historyBuffer.length > 600) {
            this.historyBuffer.shift();
        }
    }
    getLatest() {
        return this.latestMetrics;
    }
    getHistory(limit = 60) {
        return this.historyBuffer.slice(-limit);
    }
    async persistReading(metrics, userId = 'demo_user_anonymous') {
        try {
            if (this.envModel) {
                await this.envModel.create({
                    userId,
                    temperature: metrics.temperature,
                    humidity: metrics.humidity,
                    pressure: metrics.pressure,
                    airQuality: metrics.airQuality,
                    timestamp: new Date(),
                });
            }
        }
        catch (e) {
        }
    }
};
exports.EnvironmentService = EnvironmentService;
exports.EnvironmentService = EnvironmentService = EnvironmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(environment_reading_schema_1.EnvironmentReading.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EnvironmentService);
//# sourceMappingURL=environment.service.js.map