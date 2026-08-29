import { RiskEngineService } from './risk-engine.service';
import {
  IEnvironmentMetrics,
  IHealthMetrics,
  IMotionMetrics,
} from '../common/interfaces/telemetry.interface';

describe('RiskEngineService', () => {
  let service: RiskEngineService;

  beforeEach(() => {
    service = new RiskEngineService();
  });

  it('should evaluate healthy vitals as NORMAL status', () => {
    const health: IHealthMetrics = {
      heartRate: 72,
      spo2: 98.5,
      bodyTemperature: 36.7,
      activity: 'Normal',
      hrTrend: 'STABLE',
      tempTrend: 'STABLE',
      spo2Trend: 'STABLE',
    };
    const env: IEnvironmentMetrics = {
      temperature: 24.0,
      humidity: 50,
      pressure: 1013,
      airQuality: { aqi: 35, pm25: 10, status: 'GOOD' },
      heatIndex: 24.0,
    };
    const motion: IMotionMetrics = {
      acceleration: 1.0,
      orientation: 'Standing',
      fallDetected: false,
      inactivityTimer: 0,
    };

    const assessment = service.analyze(health, env, motion, 'NORMAL');
    expect(assessment.status).toBe('NORMAL');
    expect(assessment.riskScore).toBeLessThan(40);
    expect(assessment.disclaimer).toContain('Strictly non-diagnostic');
  });

  it('should detect HEAT_STRESS condition during hyperthermia & extreme heat', () => {
    const health: IHealthMetrics = {
      heartRate: 135,
      spo2: 96.0,
      bodyTemperature: 39.5,
      activity: 'High',
      hrTrend: 'UP',
      tempTrend: 'UP',
      spo2Trend: 'STABLE',
    };
    const env: IEnvironmentMetrics = {
      temperature: 44.0,
      humidity: 78,
      pressure: 1008,
      airQuality: { aqi: 85, pm25: 35, status: 'MODERATE' },
      heatIndex: 48.0,
    };
    const motion: IMotionMetrics = {
      acceleration: 1.1,
      orientation: 'Standing',
      fallDetected: false,
      inactivityTimer: 0,
    };

    const assessment = service.analyze(health, env, motion, 'HEAT_WAVE');
    expect(assessment.status).toBe('CRITICAL');
    expect(assessment.riskType).toBe('HEAT_STRESS');
    expect(assessment.reasons.some((r) => r.includes('hyperthermia') || r.includes('39.5'))).toBe(
      true,
    );
  });

  it('should detect RESPIRATORY_RISK when AQI is hazardous and SpO2 drops', () => {
    const health: IHealthMetrics = {
      heartRate: 98,
      spo2: 91.0,
      bodyTemperature: 37.0,
      activity: 'Normal',
      hrTrend: 'STABLE',
      tempTrend: 'STABLE',
      spo2Trend: 'DOWN',
    };
    const env: IEnvironmentMetrics = {
      temperature: 28.0,
      humidity: 60,
      pressure: 1012,
      airQuality: { aqi: 385, pm25: 220, status: 'HAZARDOUS' },
      heatIndex: 29.0,
    };
    const motion: IMotionMetrics = {
      acceleration: 1.0,
      orientation: 'Standing',
      fallDetected: false,
      inactivityTimer: 0,
    };

    const assessment = service.analyze(health, env, motion, 'POLLUTION');
    expect(assessment.status).toBe('WARNING');
    expect(assessment.riskType).toBe('RESPIRATORY_RISK');
    expect(assessment.reasons.some((r) => r.includes('AQI') || r.includes('oxygen'))).toBe(true);
  });

  it('should immediately flag FALL_RISK and elevate risk when a fall is detected', () => {
    const health: IHealthMetrics = {
      heartRate: 110,
      spo2: 97.0,
      bodyTemperature: 36.8,
      activity: 'Impact/Fall',
      hrTrend: 'UP',
      tempTrend: 'STABLE',
      spo2Trend: 'STABLE',
    };
    const env: IEnvironmentMetrics = {
      temperature: 25.0,
      humidity: 50,
      pressure: 1013,
      airQuality: { aqi: 40, pm25: 12, status: 'GOOD' },
      heatIndex: 25.0,
    };
    const motion: IMotionMetrics = {
      acceleration: 4.3,
      orientation: 'Sudden Drop',
      fallDetected: true,
      inactivityTimer: 2,
    };

    const assessment = service.analyze(health, env, motion, 'NORMAL');
    expect(assessment.status).toBe('CRITICAL');
    expect(assessment.riskType).toBe('FALL_RISK');
    expect(assessment.riskScore).toBeGreaterThanOrEqual(85);
  });
});
