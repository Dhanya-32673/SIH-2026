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
var SensorSimulatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorSimulatorService = void 0;
const common_1 = require("@nestjs/common");
let SensorSimulatorService = SensorSimulatorService_1 = class SensorSimulatorService {
    constructor() {
        this.logger = new common_1.Logger(SensorSimulatorService_1.name);
        this.currentScenario = 'NORMAL';
        this.currentDisasterMode = 'NORMAL';
        this.scenarioStepCount = 0;
        this.currentHR = 76.0;
        this.currentSpO2 = 98.2;
        this.currentBodyTemp = 36.7;
        this.currentEnvTemp = 26.5;
        this.currentHumidity = 48.0;
        this.currentPressure = 1013.2;
        this.currentAQI = 38.0;
        this.currentPM25 = 12.4;
        this.currentAcceleration = 1.0;
        this.currentOrientation = 'Standing';
        this.fallDetected = false;
        this.inactivitySeconds = 0;
        this.scenarioTargets = {
            NORMAL: {
                hr: 74,
                spo2: 98.5,
                bodyTemp: 36.7,
                envTemp: 25.0,
                humidity: 50.0,
                aqi: 35,
                pm25: 12.0,
                activity: 'Normal',
            },
            HEAT_STRESS: {
                hr: 132,
                spo2: 96.0,
                bodyTemp: 39.4,
                envTemp: 44.5,
                humidity: 78.0,
                aqi: 85,
                pm25: 35.0,
                activity: 'High',
            },
            POLLUTION: {
                hr: 98,
                spo2: 91.5,
                bodyTemp: 37.1,
                envTemp: 29.0,
                humidity: 62.0,
                aqi: 380,
                pm25: 220.0,
                activity: 'Moderate',
            },
            FALL: {
                hr: 115,
                spo2: 96.5,
                bodyTemp: 36.8,
                envTemp: 26.0,
                humidity: 52.0,
                aqi: 42,
                pm25: 15.0,
                activity: 'Impact/Fall',
            },
            CRITICAL: {
                hr: 154,
                spo2: 86.5,
                bodyTemp: 40.3,
                envTemp: 43.0,
                humidity: 82.0,
                aqi: 395,
                pm25: 245.0,
                activity: 'Impact/Fall',
            },
        };
        this.logger.log('SensorSimulatorService initialized with scenario: NORMAL');
    }
    setScenario(scenario) {
        this.logger.log(`Switching simulation scenario to: ${scenario}`);
        this.currentScenario = scenario;
        this.scenarioStepCount = 0;
        if (scenario === 'FALL') {
            this.currentAcceleration = 4.2;
            this.currentOrientation = 'Sudden Drop';
            this.fallDetected = true;
            this.inactivitySeconds = 0;
        }
        else {
            this.fallDetected = false;
            this.currentAcceleration = 1.0;
            this.currentOrientation = 'Standing';
            this.inactivitySeconds = 0;
        }
    }
    getScenario() {
        return this.currentScenario;
    }
    setDisasterMode(mode) {
        this.logger.log(`Switching disaster mode to: ${mode}`);
        this.currentDisasterMode = mode;
    }
    getDisasterMode() {
        return this.currentDisasterMode;
    }
    generateNextTick() {
        this.scenarioStepCount++;
        const target = this.scenarioTargets[this.currentScenario];
        const alpha = this.currentScenario === 'FALL' ? 0.4 : 0.18;
        const noiseHR = (Math.random() - 0.5) * 1.8;
        const noiseSpO2 = (Math.random() - 0.5) * 0.3;
        const noiseBodyTemp = (Math.random() - 0.5) * 0.05;
        const noiseEnvTemp = (Math.random() - 0.5) * 0.15;
        const noiseHumidity = (Math.random() - 0.5) * 0.4;
        const noiseAQI = (Math.random() - 0.5) * 2.5;
        const prevHR = this.currentHR;
        const prevTemp = this.currentBodyTemp;
        const prevSpO2 = this.currentSpO2;
        this.currentHR = this.currentHR + (target.hr - this.currentHR) * alpha + noiseHR;
        this.currentSpO2 = Math.min(100, Math.max(75, this.currentSpO2 + (target.spo2 - this.currentSpO2) * alpha + noiseSpO2));
        this.currentBodyTemp =
            this.currentBodyTemp + (target.bodyTemp - this.currentBodyTemp) * alpha + noiseBodyTemp;
        this.currentEnvTemp =
            this.currentEnvTemp + (target.envTemp - this.currentEnvTemp) * alpha + noiseEnvTemp;
        this.currentHumidity = Math.min(99, Math.max(20, this.currentHumidity + (target.humidity - this.currentHumidity) * alpha + noiseHumidity));
        this.currentAQI = Math.max(10, this.currentAQI + (target.aqi - this.currentAQI) * alpha + noiseAQI);
        this.currentPM25 = Math.max(2, this.currentPM25 + (target.pm25 - this.currentPM25) * alpha + noiseAQI * 0.4);
        if (this.currentScenario === 'FALL') {
            if (this.scenarioStepCount === 1) {
                this.currentAcceleration = 4.3;
                this.currentOrientation = 'Sudden Drop';
            }
            else if (this.scenarioStepCount === 2) {
                this.currentAcceleration = 0.2;
                this.currentOrientation = 'Lying Down';
            }
            else {
                this.currentAcceleration = 0.98 + (Math.random() - 0.5) * 0.04;
                this.currentOrientation = 'Lying Down';
                this.inactivitySeconds += 1;
            }
        }
        else {
            this.currentAcceleration = 1.0 + (Math.random() - 0.5) * 0.08;
        }
        const heatIndex = this.calculateHeatIndex(this.currentEnvTemp, this.currentHumidity);
        let aqiStatus = 'GOOD';
        if (this.currentAQI > 300)
            aqiStatus = 'HAZARDOUS';
        else if (this.currentAQI > 150)
            aqiStatus = 'POOR';
        else if (this.currentAQI > 50)
            aqiStatus = 'MODERATE';
        let activityState = target.activity;
        if (this.currentScenario === 'NORMAL') {
            activityState = this.scenarioStepCount % 12 > 7 ? 'Normal' : 'Resting';
        }
        const hrTrend = this.currentHR > prevHR + 0.3 ? 'UP' : this.currentHR < prevHR - 0.3 ? 'DOWN' : 'STABLE';
        const tempTrend = this.currentBodyTemp > prevTemp + 0.05
            ? 'UP'
            : this.currentBodyTemp < prevTemp - 0.05
                ? 'DOWN'
                : 'STABLE';
        const spo2Trend = this.currentSpO2 > prevSpO2 + 0.2
            ? 'UP'
            : this.currentSpO2 < prevSpO2 - 0.2
                ? 'DOWN'
                : 'STABLE';
        const ppgWaveform = this.generatePPGWave(this.currentHR);
        return {
            health: {
                heartRate: Math.round(this.currentHR),
                spo2: Number(this.currentSpO2.toFixed(1)),
                bodyTemperature: Number(this.currentBodyTemp.toFixed(1)),
                activity: activityState,
                ppgWaveform,
                hrTrend,
                tempTrend,
                spo2Trend,
            },
            environment: {
                temperature: Number(this.currentEnvTemp.toFixed(1)),
                humidity: Math.round(this.currentHumidity),
                pressure: Number(this.currentPressure.toFixed(1)),
                airQuality: {
                    aqi: Math.round(this.currentAQI),
                    pm25: Number(this.currentPM25.toFixed(1)),
                    status: aqiStatus,
                },
                heatIndex: Number(heatIndex.toFixed(1)),
            },
            motion: {
                acceleration: Number(this.currentAcceleration.toFixed(2)),
                orientation: this.currentOrientation,
                fallDetected: this.fallDetected,
                inactivityTimer: this.inactivitySeconds,
            },
        };
    }
    calculateHeatIndex(tempC, rh) {
        if (tempC < 27)
            return tempC;
        const T = (tempC * 9) / 5 + 32;
        const R = rh;
        const hiF = -42.379 +
            2.04901523 * T +
            10.14333127 * R -
            0.22475541 * T * R -
            0.00683783 * T * T -
            0.05481717 * R * R +
            0.00122874 * T * T * R +
            0.00085282 * T * R * R -
            0.00000199 * T * T * R * R;
        return ((hiF - 32) * 5) / 9;
    }
    generatePPGWave(bpm) {
        const samples = [];
        const freq = bpm / 60;
        const timeNow = Date.now() / 1000;
        for (let i = 0; i < 12; i++) {
            const t = timeNow + i * (1 / 12);
            const phase = (t * freq * 2 * Math.PI) % (2 * Math.PI);
            const systolic = Math.exp(-Math.pow(phase - 1.2, 2) / 0.35);
            const dicrotic = 0.35 * Math.exp(-Math.pow(phase - 2.8, 2) / 0.45);
            const val = Math.max(0, systolic + dicrotic);
            samples.push(Number(val.toFixed(3)));
        }
        return samples;
    }
};
exports.SensorSimulatorService = SensorSimulatorService;
exports.SensorSimulatorService = SensorSimulatorService = SensorSimulatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SensorSimulatorService);
//# sourceMappingURL=sensor-simulator.service.js.map