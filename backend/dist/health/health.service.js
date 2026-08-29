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
var HealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const health_reading_schema_1 = require("../database/schemas/health-reading.schema");
let HealthService = HealthService_1 = class HealthService {
    constructor(healthModel) {
        this.healthModel = healthModel;
        this.logger = new common_1.Logger(HealthService_1.name);
        this.latestMetrics = {
            heartRate: 76,
            spo2: 98.4,
            bodyTemperature: 36.7,
            activity: 'Normal',
            hrTrend: 'STABLE',
            tempTrend: 'STABLE',
            spo2Trend: 'STABLE',
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
            if (this.healthModel) {
                await this.healthModel.create({
                    userId,
                    heartRate: metrics.heartRate,
                    spo2: metrics.spo2,
                    bodyTemperature: metrics.bodyTemperature,
                    activity: metrics.activity,
                    timestamp: new Date(),
                });
            }
        }
        catch (e) {
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = HealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(health_reading_schema_1.HealthReading.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], HealthService);
//# sourceMappingURL=health.service.js.map