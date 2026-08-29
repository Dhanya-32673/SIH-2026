import { Injectable } from '@nestjs/common';
import { HealthService } from '../health/health.service';
import { EnvironmentService } from '../environment/environment.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { SensorSimulatorService } from '../simulation/sensor-simulator.service';

@Injectable()
export class HistoryService {
  constructor(
    private readonly healthService: HealthService,
    private readonly envService: EnvironmentService,
    private readonly riskEngine: RiskEngineService,
    private readonly simulator: SensorSimulatorService,
  ) {}

  public getHistory(points = 60) {
    const healthHistory = this.healthService.getHistory(points);
    const envHistory = this.envService.getHistory(points);
    const count = Math.max(healthHistory.length, envHistory.length);

    // If buffer is still young (just started), synthesize realistic pre-history buffer for smooth graphs
    const dataPoints: Array<{
      timestamp: string;
      heartRate: number;
      spo2: number;
      bodyTemperature: number;
      envTemperature: number;
      humidity: number;
      aqi: number;
      riskScore: number;
      status: string;
    }> = [];

    const now = Date.now();
    const needed = Math.max(points, 30);

    for (let i = needed - 1; i >= 0; i--) {
      const timeOffset = now - i * 1000;
      const h = healthHistory[healthHistory.length - 1 - i] || this.healthService.getLatest();
      const e = envHistory[envHistory.length - 1 - i] || this.envService.getLatest();

      // Add gentle drift for synthesized older points
      const hrVariance = Math.sin(i * 0.15) * 2;
      const tempVariance = Math.cos(i * 0.1) * 0.05;

      const risk = this.riskEngine.analyze(
        { ...h, heartRate: Math.round(h.heartRate + hrVariance) },
        e,
        {
          acceleration: 1.0,
          orientation: 'Standing',
          fallDetected: false,
          inactivityTimer: 0,
        },
      );

      dataPoints.push({
        timestamp: new Date(timeOffset).toISOString(),
        heartRate: Math.round(h.heartRate + hrVariance),
        spo2: h.spo2,
        bodyTemperature: Number((h.bodyTemperature + tempVariance).toFixed(1)),
        envTemperature: e.temperature,
        humidity: e.humidity,
        aqi: e.airQuality.aqi,
        riskScore: risk.riskScore,
        status: risk.status,
      });
    }

    return {
      success: true,
      points: dataPoints.length,
      data: dataPoints,
    };
  }
}
