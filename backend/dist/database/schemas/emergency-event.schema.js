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
exports.EmergencyEventSchema = exports.EmergencyEvent = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let EmergencyEvent = class EmergencyEvent {
};
exports.EmergencyEvent = EmergencyEvent;
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'demo_user_anonymous' }),
    __metadata("design:type", String)
], EmergencyEvent.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmergencyEvent.prototype, "riskType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['DETECTED', 'COUNTDOWN', 'USER_CONFIRMED_SAFE', 'ESCALATED'],
        default: 'DETECTED',
    }),
    __metadata("design:type", String)
], EmergencyEvent.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], EmergencyEvent.prototype, "triggerFactors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], EmergencyEvent.prototype, "snapshotTelemetry", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            latitude: 16.4419,
            longitude: 80.6222,
            accuracy: '5m',
            label: 'SIH Hackathon Campus, Vijayawada, India',
        },
    }),
    __metadata("design:type", Object)
], EmergencyEvent.prototype, "simulatedLocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], EmergencyEvent.prototype, "triggeredAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], EmergencyEvent.prototype, "resolvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], EmergencyEvent.prototype, "escalatedAt", void 0);
exports.EmergencyEvent = EmergencyEvent = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], EmergencyEvent);
exports.EmergencyEventSchema = mongoose_1.SchemaFactory.createForClass(EmergencyEvent);
//# sourceMappingURL=emergency-event.schema.js.map