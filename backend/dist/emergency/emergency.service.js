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
var EmergencyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const emergency_event_schema_1 = require("../database/schemas/emergency-event.schema");
let EmergencyService = EmergencyService_1 = class EmergencyService {
    constructor(emergencyModel) {
        this.emergencyModel = emergencyModel;
        this.logger = new common_1.Logger(EmergencyService_1.name);
        this.activeEmergency = null;
    }
    getActiveEmergency() {
        return this.activeEmergency;
    }
    triggerEmergency(userId, risk, snapshotTelemetry) {
        if (this.activeEmergency && this.activeEmergency.state === 'COUNTDOWN') {
            return this.activeEmergency;
        }
        const eventId = `emerg-${Date.now()}`;
        this.activeEmergency = {
            id: eventId,
            userId,
            riskType: risk.riskType,
            state: 'COUNTDOWN',
            countdownRemaining: 10,
            triggerFactors: risk.reasons,
            simulatedLocation: {
                latitude: 16.4419,
                longitude: 80.6222,
                accuracy: '4.8 meters (GNSS L1/L5 Simulation)',
                label: 'SIH Hackathon Control Center, Tech Zone 4, AP, India',
            },
            triggeredAt: new Date(),
        };
        this.logger.warn(`EMERGENCY INITIATED [${risk.riskType}] - 10s Countdown Started.`);
        return this.activeEmergency;
    }
    async respondToEmergency(action, userId = 'demo_user_anonymous') {
        if (!this.activeEmergency) {
            return {
                success: true,
                message: 'No active emergency in progress.',
                state: 'NORMAL',
            };
        }
        if (action === 'SAFE') {
            this.activeEmergency.state = 'USER_CONFIRMED_SAFE';
            this.activeEmergency.resolvedAt = new Date();
            this.logger.log('Emergency dismissed: User confirmed safe.');
            try {
                if (this.emergencyModel) {
                    await this.emergencyModel.create(this.activeEmergency);
                }
            }
            catch (e) {
            }
            const copy = { ...this.activeEmergency };
            setTimeout(() => {
                if (this.activeEmergency?.state === 'USER_CONFIRMED_SAFE') {
                    this.activeEmergency = null;
                }
            }, 3000);
            return {
                success: true,
                message: 'Emergency dismissed: User confirmed safe.',
                emergency: copy,
            };
        }
        else {
            this.activeEmergency.state = 'ESCALATED';
            this.activeEmergency.escalatedAt = new Date();
            this.logger.warn('Emergency escalated: Simulated SOS dispatch beacon broadcasted.');
            try {
                if (this.emergencyModel) {
                    await this.emergencyModel.create(this.activeEmergency);
                }
            }
            catch (e) {
            }
            return {
                success: true,
                message: 'Emergency escalation simulated. Distress telemetry packet compiled.',
                emergency: this.activeEmergency,
            };
        }
    }
    decrementCountdown() {
        if (!this.activeEmergency || this.activeEmergency.state !== 'COUNTDOWN') {
            return 0;
        }
        this.activeEmergency.countdownRemaining = Math.max(0, this.activeEmergency.countdownRemaining - 1);
        if (this.activeEmergency.countdownRemaining === 0) {
            this.activeEmergency.state = 'ESCALATED';
            this.activeEmergency.escalatedAt = new Date();
            this.logger.warn('Countdown expired: Emergency automatically escalated (Simulated).');
        }
        return this.activeEmergency.countdownRemaining;
    }
    clearEmergency() {
        this.activeEmergency = null;
    }
};
exports.EmergencyService = EmergencyService;
exports.EmergencyService = EmergencyService = EmergencyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(emergency_event_schema_1.EmergencyEvent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EmergencyService);
//# sourceMappingURL=emergency.service.js.map