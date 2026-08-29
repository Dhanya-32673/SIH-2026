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
var AlertsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const alert_schema_1 = require("../database/schemas/alert.schema");
let AlertsService = AlertsService_1 = class AlertsService {
    constructor(alertModel) {
        this.alertModel = alertModel;
        this.logger = new common_1.Logger(AlertsService_1.name);
        this.lastAlertStatus = 'NORMAL';
        this.lastAlertTimestamp = 0;
        this.memoryAlerts = [
            {
                id: 'init-alert-1',
                userId: 'demo_user_anonymous',
                severity: 'INFO',
                type: 'SYSTEM_STARTUP',
                message: 'AI Health Companion monitoring daemon initialized.',
                reasons: ['Sensor simulation pipeline active', 'Rule-based risk evaluator active'],
                recommendedActions: ['Wear companion sensor ring securely', 'Ensure device sync'],
                acknowledged: true,
                timestamp: new Date(Date.now() - 360000),
            },
        ];
    }
    async evaluateAndCreateAlert(userId, risk) {
        const now = Date.now();
        const timeSinceLastAlert = now - this.lastAlertTimestamp;
        const statusChanged = risk.status !== this.lastAlertStatus;
        const shouldAlert = (statusChanged && risk.status !== 'NORMAL') ||
            (risk.status === 'CRITICAL' && timeSinceLastAlert > 15000) ||
            (risk.riskType === 'FALL_RISK' && this.lastAlertStatus !== 'CRITICAL');
        if (!shouldAlert) {
            if (risk.status === 'NORMAL') {
                this.lastAlertStatus = 'NORMAL';
            }
            return null;
        }
        this.lastAlertStatus = risk.status;
        this.lastAlertTimestamp = now;
        const severity = risk.status === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
        let message = `Elevated health risk condition detected: ${risk.riskType.replace(/_/g, ' ')}`;
        if (risk.riskType === 'FALL_RISK') {
            message = 'FALL DETECTED: Sudden impact spike followed by immobility.';
        }
        else if (risk.riskType === 'HEAT_STRESS') {
            message = 'HEAT STRESS WARNING: Hyperthermic vital signs detected.';
        }
        else if (risk.riskType === 'RESPIRATORY_RISK') {
            message = 'RESPIRATORY WARNING: Deteriorating SpO2 under hazardous air quality.';
        }
        const alertData = {
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            userId,
            severity,
            type: risk.riskType,
            message,
            reasons: risk.reasons,
            recommendedActions: risk.recommendedActions,
            acknowledged: false,
            timestamp: new Date(),
        };
        this.memoryAlerts.unshift(alertData);
        if (this.memoryAlerts.length > 50) {
            this.memoryAlerts.pop();
        }
        try {
            if (this.alertModel) {
                await this.alertModel.create(alertData);
            }
        }
        catch (err) {
            this.logger.warn(`Failed to persist alert to MongoDB (cached in-memory): ${err.message}`);
        }
        this.logger.log(`Created alert [${severity}]: ${message}`);
        return alertData;
    }
    async getAlerts(limit = 20) {
        try {
            if (this.alertModel) {
                const docs = await this.alertModel
                    .find()
                    .sort({ timestamp: -1 })
                    .limit(limit)
                    .lean()
                    .exec();
                if (docs && docs.length > 0) {
                    return docs.map((doc) => ({
                        id: doc._id?.toString() || doc.id,
                        ...doc,
                    }));
                }
            }
        }
        catch (err) {
            this.logger.warn(`MongoDB query failed, serving from memory cache: ${err.message}`);
        }
        return this.memoryAlerts.slice(0, limit);
    }
    async getRecentAlerts() {
        return this.getAlerts(5);
    }
    async acknowledgeAlert(id) {
        const memIndex = this.memoryAlerts.findIndex((a) => a.id === id);
        if (memIndex >= 0) {
            this.memoryAlerts[memIndex].acknowledged = true;
        }
        try {
            if (this.alertModel) {
                await this.alertModel.updateOne({ $or: [{ _id: id }, { id }] }, { $set: { acknowledged: true, acknowledgedAt: new Date() } });
            }
            return true;
        }
        catch (err) {
            this.logger.warn(`MongoDB acknowledge error: ${err.message}`);
            return true;
        }
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = AlertsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(alert_schema_1.Alert.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map