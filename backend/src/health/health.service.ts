import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealthReading, HealthReadingDocument } from '../database/schemas/health-reading.schema';
import { IHealthMetrics } from '../common/interfaces/telemetry.interface';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private latestMetrics: IHealthMetrics = {
    heartRate: 76,
    spo2: 98.4,
    bodyTemperature: 36.7,
    activity: 'Normal',
    hrTrend: 'STABLE',
    tempTrend: 'STABLE',
    spo2Trend: 'STABLE',
  };

  private historyBuffer: Array<IHealthMetrics & { timestamp: Date }> = [];

  constructor(
    @InjectModel(HealthReading.name)
    private readonly healthModel?: Model<HealthReadingDocument>,
  ) {}

  public updateLatest(metrics: IHealthMetrics) {
    this.latestMetrics = metrics;
    this.historyBuffer.push({ ...metrics, timestamp: new Date() });
    if (this.historyBuffer.length > 600) {
      this.historyBuffer.shift();
    }
  }

  public getLatest(): IHealthMetrics {
    return this.latestMetrics;
  }

  public getHistory(limit = 60) {
    return this.historyBuffer.slice(-limit);
  }

  public async persistReading(metrics: IHealthMetrics, userId = 'demo_user_anonymous') {
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
    } catch (e) {
      // Memory fallback
    }
  }
}
