import { Model } from 'mongoose';
import { EnvironmentReadingDocument } from '../database/schemas/environment-reading.schema';
import { IEnvironmentMetrics } from '../common/interfaces/telemetry.interface';
export declare class EnvironmentService {
    private readonly envModel?;
    private readonly logger;
    private latestMetrics;
    private historyBuffer;
    constructor(envModel?: Model<EnvironmentReadingDocument>);
    updateLatest(metrics: IEnvironmentMetrics): void;
    getLatest(): IEnvironmentMetrics;
    getHistory(limit?: number): (IEnvironmentMetrics & {
        timestamp: Date;
    })[];
    persistReading(metrics: IEnvironmentMetrics, userId?: string): Promise<void>;
}
