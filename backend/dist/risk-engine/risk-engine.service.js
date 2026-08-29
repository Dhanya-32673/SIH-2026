"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RiskEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskEngineService = void 0;
const common_1 = require("@nestjs/common");
let RiskEngineService = RiskEngineService_1 = class RiskEngineService {
    constructor() {
        this.logger = new common_1.Logger(RiskEngineService_1.name);
        this.DISCLAIMER = 'Prototype Risk Indicator — Strictly non-diagnostic health monitoring assistance. Not a substitute for professional medical care.';
    }
    analyze(health, environment, motion, disasterMode = 'NORMAL') {
        const factors = {
            temperatureRisk: 0,
            heartRateRisk: 0,
            spo2Risk: 0,
            environmentRisk: 0,
            activityRisk: 0,
            fallRisk: 0,
        };
        const reasons = [];
        const recommendedActions = [];
        const temp = health.bodyTemperature;
        if (temp >= 39.5) {
            factors.temperatureRisk = 95;
            reasons.push(`Critical core body hyperthermia detected (${temp.toFixed(1)}°C) exceeding safe threshold.`);
            recommendedActions.push('Move immediately to shaded/air-conditioned environment and initiate active body cooling.');
        }
        else if (temp >= 38.2) {
            factors.temperatureRisk = 65;
            reasons.push(`Elevated body temperature (${temp.toFixed(1)}°C) indicating physiological thermal strain.`);
            recommendedActions.push('Hydrate with cool electrolyte fluids and rest in a well-ventilated location.');
        }
        else if (temp <= 35.2) {
            factors.temperatureRisk = 80;
            reasons.push(`Hypothermic core temperature drop (${temp.toFixed(1)}°C) below physiological baseline.`);
            recommendedActions.push('Add insulating layers and seek warm shelter to prevent progressive hypothermia.');
        }
        else {
            factors.temperatureRisk = 10;
        }
        const hr = health.heartRate;
        if (hr >= 140) {
            factors.heartRateRisk = 90;
            reasons.push(`Severe tachycardia (${hr} BPM) detected exceeding normal physical tolerance.`);
            recommendedActions.push('Cease all physical exertion immediately and sit or lie down in a safe position.');
        }
        else if (hr >= 115) {
            factors.heartRateRisk = 55;
            reasons.push(`Elevated heart rate (${hr} BPM) indicating cardiovascular workload elevation.`);
            recommendedActions.push('Reduce physical intensity and practice slow, deep diaphragmatic breathing.');
        }
        else if (hr <= 42) {
            factors.heartRateRisk = 85;
            reasons.push(`Critical bradycardia (${hr} BPM) detected below safe resting parameters.`);
            recommendedActions.push('Check alertness and seek medical guidance if dizziness or confusion is present.');
        }
        else {
            factors.heartRateRisk = 5;
        }
        const spo2 = health.spo2;
        if (spo2 <= 88.0) {
            factors.spo2Risk = 95;
            reasons.push(`Severe hypoxemia alert: Blood oxygen level dropped to dangerous levels (${spo2.toFixed(1)}%).`);
            recommendedActions.push('Ensure clear airway, remain calm, and seek emergency oxygen support if available.');
        }
        else if (spo2 <= 93.5) {
            factors.spo2Risk = 60;
            reasons.push(`Sub-optimal blood oxygen saturation (${spo2.toFixed(1)}%) below normal 95% baseline.`);
            recommendedActions.push('Rest in an upright posture, avoid smoke/dust exposure, and monitor respiration.');
        }
        else {
            factors.spo2Risk = 5;
        }
        const envTemp = environment.temperature;
        const aqi = environment.airQuality.aqi;
        const pm25 = environment.airQuality.pm25;
        const heatIndex = environment.heatIndex;
        let envScore = 5;
        if (heatIndex >= 42 || envTemp >= 42) {
            envScore += 45;
            reasons.push(`Hazardous ambient thermal environment: Ambient Temp ${envTemp.toFixed(1)}°C, Heat Index ${heatIndex.toFixed(1)}°C.`);
            recommendedActions.push('Stay indoors during peak solar hours and drink at least 500ml water every hour.');
        }
        else if (heatIndex >= 36) {
            envScore += 25;
            reasons.push(`Elevated heat index (${heatIndex.toFixed(1)}°C) increases cumulative dehydration risk.`);
        }
        if (aqi >= 300) {
            envScore += 45;
            reasons.push(`Hazardous Air Quality Index (AQI ${aqi}, PM2.5 ${pm25.toFixed(1)} µg/m³) exceeding health limits.`);
            recommendedActions.push('Wear an N95/HEPA particulate respirator and seal indoor ventilation.');
        }
        else if (aqi >= 150) {
            envScore += 25;
            reasons.push(`Unhealthy Air Quality (AQI ${aqi}) may exacerbate respiratory sensitivity.`);
            recommendedActions.push('Limit outdoor physical activities and use air purification if accessible.');
        }
        factors.environmentRisk = Math.min(100, envScore);
        if (health.activity === 'High' && (heatIndex >= 38 || temp >= 38.0)) {
            factors.activityRisk = 75;
            reasons.push('Vigorous physical activity in high thermal stress conditions substantially accelerates metabolic heat buildup.');
        }
        else if (health.activity === 'Impact/Fall') {
            factors.activityRisk = 80;
        }
        else {
            factors.activityRisk = 10;
        }
        if (motion.fallDetected) {
            factors.fallRisk = 95;
            reasons.push(`Biometric motion sensors detected a high-impact fall (${motion.acceleration.toFixed(1)}g) with ${motion.inactivityTimer}s post-impact immobility.`);
            recommendedActions.push('If you are uninjured, press "I\'M SAFE" to dismiss emergency protocol.');
        }
        else {
            factors.fallRisk = 0;
        }
        let weights = {
            temp: 0.22,
            hr: 0.22,
            spo2: 0.24,
            env: 0.16,
            activity: 0.08,
            fall: 0.08,
        };
        if (disasterMode === 'HEAT_WAVE') {
            weights = {
                temp: 0.32,
                hr: 0.24,
                spo2: 0.1,
                env: 0.24,
                activity: 0.1,
                fall: 0.0,
            };
        }
        else if (disasterMode === 'POLLUTION') {
            weights = {
                temp: 0.1,
                hr: 0.15,
                spo2: 0.4,
                env: 0.3,
                activity: 0.05,
                fall: 0.0,
            };
        }
        else if (disasterMode === 'DISASTER') {
            weights = {
                temp: 0.15,
                hr: 0.15,
                spo2: 0.15,
                env: 0.2,
                activity: 0.05,
                fall: 0.3,
            };
        }
        let calculatedScore = factors.temperatureRisk * weights.temp +
            factors.heartRateRisk * weights.hr +
            factors.spo2Risk * weights.spo2 +
            factors.environmentRisk * weights.env +
            factors.activityRisk * weights.activity +
            factors.fallRisk * weights.fall;
        if (motion.fallDetected) {
            calculatedScore = Math.max(calculatedScore, 88);
        }
        let status = 'NORMAL';
        let riskType = 'NONE';
        const normalizedScore = Math.min(100, Math.max(0, Math.round(calculatedScore)));
        if (normalizedScore >= 70 ||
            motion.fallDetected ||
            spo2 <= 88 ||
            temp >= 39.2 ||
            (temp >= 38.8 && hr >= 125) ||
            (factors.temperatureRisk >= 80 && factors.heartRateRisk >= 80)) {
            status = 'CRITICAL';
        }
        else if (normalizedScore >= 38 || spo2 <= 93.5 || temp >= 38.0 || hr >= 110 || aqi >= 180) {
            status = 'WARNING';
        }
        else {
            status = 'NORMAL';
        }
        if (motion.fallDetected) {
            riskType = 'FALL_RISK';
        }
        else if (factors.temperatureRisk > 60 &&
            (factors.environmentRisk > 40 || factors.heartRateRisk > 50)) {
            riskType = 'HEAT_STRESS';
        }
        else if (factors.spo2Risk > 50 || aqi > 250) {
            riskType = 'RESPIRATORY_RISK';
        }
        else if ((factors.temperatureRisk > 50 && factors.spo2Risk > 50) ||
            (factors.heartRateRisk > 70 && factors.spo2Risk > 70)) {
            riskType = 'CRITICAL';
        }
        else if (status === 'WARNING') {
            riskType = factors.temperatureRisk > factors.spo2Risk ? 'HEAT_STRESS' : 'RESPIRATORY_RISK';
        }
        else {
            riskType = 'NONE';
        }
        if (reasons.length === 0) {
            reasons.push('All monitored physiological and environmental parameters remain within healthy baseline ranges.');
            recommendedActions.push('Maintain normal hydration and standard daily wellness activity.');
        }
        const confidence = Math.min(98, Math.max(85, Math.round(92 + (Math.random() - 0.5) * 6)));
        return {
            status,
            riskType,
            riskScore: normalizedScore,
            confidence,
            reasons,
            recommendedActions: Array.from(new Set(recommendedActions)),
            factors,
            disclaimer: this.DISCLAIMER,
            evaluatedAt: new Date().toISOString(),
        };
    }
};
exports.RiskEngineService = RiskEngineService;
exports.RiskEngineService = RiskEngineService = RiskEngineService_1 = __decorate([
    (0, common_1.Injectable)()
], RiskEngineService);
//# sourceMappingURL=risk-engine.service.js.map