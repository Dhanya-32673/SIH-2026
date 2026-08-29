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
exports.RiskAssessmentSchema = exports.RiskAssessment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let RiskAssessment = class RiskAssessment {
};
exports.RiskAssessment = RiskAssessment;
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'demo_user_anonymous' }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['NORMAL', 'WARNING', 'CRITICAL'] }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], RiskAssessment.prototype, "riskType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, max: 100 }),
    __metadata("design:type", Number)
], RiskAssessment.prototype, "riskScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, max: 100 }),
    __metadata("design:type", Number)
], RiskAssessment.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], RiskAssessment.prototype, "reasons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], RiskAssessment.prototype, "recommendedActions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], RiskAssessment.prototype, "factors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], RiskAssessment.prototype, "timestamp", void 0);
exports.RiskAssessment = RiskAssessment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], RiskAssessment);
exports.RiskAssessmentSchema = mongoose_1.SchemaFactory.createForClass(RiskAssessment);
//# sourceMappingURL=risk-assessment.schema.js.map