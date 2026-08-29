import { Model } from 'mongoose';
import { HealthReadingDocument } from '../database/schemas/health-reading.schema';
import { IHealthMetrics } from '../common/interfaces/telemetry.interface';
export declare class HealthService {
    private readonly healthModel?;
    private readonly logger;
    private latestMetrics;
    private historyBuffer;
    constructor(healthModel?: Model<HealthReadingDocument>);
    updateLatest(metrics: IHealthMetrics): void;
    getLatest(): IHealthMetrics;
    getHistory(limit?: number): (IHealthMetrics & {
        timestamp: Date;
    })[];
    persistReading(metrics: IHealthMetrics, userId?: string): Promise<void>;
}
