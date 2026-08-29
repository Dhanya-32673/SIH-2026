import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EnvironmentReading,
  EnvironmentReadingDocument,
} from '../database/schemas/environment-reading.schema';
import { IEnvironmentMetrics } from '../common/interfaces/telemetry.interface';

@Injectable()
export class EnvironmentService {
  private readonly logger = new Logger(EnvironmentService.name);
  private latestMetrics: IEnvironmentMetrics = {
    temperature: 25.4,
    humidity: 48,
    pressure: 1013.2,
    airQuality: {
      aqi: 38,
      pm25: 12.4,
      status: 'GOOD',
    },
    heatIndex: 25.4,
  };

  private historyBuffer: Array<IEnvironmentMetrics & { timestamp: Date }> = [];

  constructor(
    @InjectModel(EnvironmentReading.name)
    private readonly envModel?: Model<EnvironmentReadingDocument>,
  ) {}

  public updateLatest(metrics: IEnvironmentMetrics) {
    this.latestMetrics = metrics;
    this.historyBuffer.push({ ...metrics, timestamp: new Date() });
    if (this.historyBuffer.length > 600) {
      this.historyBuffer.shift();
    }
  }

  public getLatest(): IEnvironmentMetrics {
    return this.latestMetrics;
  }

  public getHistory(limit = 60) {
    return this.historyBuffer.slice(-limit);
  }

  public async persistReading(metrics: IEnvironmentMetrics, userId = 'demo_user_anonymous') {
    try {
      if (this.envModel) {
        await this.envModel.create({
          userId,
          temperature: metrics.temperature,
          humidity: metrics.humidity,
          pressure: metrics.pressure,
          airQuality: metrics.airQuality,
          timestamp: new Date(),
        });
      }
    } catch (e) {
      // Memory fallback
    }
  }
}
