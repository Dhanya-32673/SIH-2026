import { Model } from 'mongoose';
import { AlertDocument } from '../database/schemas/alert.schema';
import { IRiskAssessment } from '../common/interfaces/telemetry.interface';
export declare class AlertsService {
    private readonly alertModel?;
    private readonly logger;
    private lastAlertStatus;
    private lastAlertTimestamp;
    private memoryAlerts;
    constructor(alertModel?: Model<AlertDocument>);
    evaluateAndCreateAlert(userId: string, risk: IRiskAssessment): Promise<any | null>;
    getAlerts(limit?: number): Promise<any[]>;
    getRecentAlerts(): Promise<any[]>;
    acknowledgeAlert(id: string): Promise<boolean>;
}
