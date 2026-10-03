import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert, AlertDocument } from '../database/schemas/alert.schema';
import { IRiskAssessment, RiskStatus } from '../common/interfaces/telemetry.interface';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);
  private lastAlertStatus: RiskStatus = 'NORMAL';
  private lastAlertTimestamp = 0;

  // In-memory resilient cache (keeps recent alerts even if DB is reconnecting)
  private memoryAlerts: Array<{
    id: string;
    userId: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    type: string;
    message: string;
    reasons: string[];
    recommendedActions: string[];
    acknowledged: boolean;
    timestamp: Date;
  }> = [
    {
      id: 'init-alert-1',
      userId: 'demo_user_anonymous',
      severity: 'INFO',
      type: 'SYSTEM_STARTUP',
      message: 'AI Health Companion monitoring daemon initialized.',
      reasons: ['Sensor simulation pipeline active', 'Rule-based risk evaluator active'],
      recommendedActions: ['Wear companion sensor ring securely', 'Ensure device sync'],
      acknowledged: true,
      timestamp: new Date(Date.now() - 360000),
    },
  ];

  constructor(
    @InjectModel(Alert.name)
    private readonly alertModel?: Model<AlertDocument>,
  ) {}

  /**
   * Evaluates if a new alert should be created and persisted based on risk transitions.
   */
  public async evaluateAndCreateAlert(
    userId: string,
    risk: IRiskAssessment,
  ): Promise<any | null> {
    const now = Date.now();
    const timeSinceLastAlert = now - this.lastAlertTimestamp;

    // Trigger alert if status transitioned to WARNING or CRITICAL,
    // or if CRITICAL persists for > 15 seconds without acknowledgment
    const statusChanged = risk.status !== this.lastAlertStatus;
    const shouldAlert =
      (statusChanged && risk.status !== 'NORMAL') ||
      (risk.status === 'CRITICAL' && timeSinceLastAlert > 15000) ||
      (risk.riskType === 'FALL_RISK' && this.lastAlertStatus !== 'CRITICAL');

    if (!shouldAlert) {
      if (risk.status === 'NORMAL') {
        this.lastAlertStatus = 'NORMAL';
      }
      return null;
    }

    this.lastAlertStatus = risk.status;
    this.lastAlertTimestamp = now;

    const severity: 'WARNING' | 'CRITICAL' | 'INFO' =
      risk.status === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
    let message = `Elevated health risk condition detected: ${risk.riskType.replace(/_/g, ' ')}`;
    if (risk.riskType === 'FALL_RISK') {
      message = 'FALL DETECTED: Sudden impact spike followed by immobility.';
    } else if (risk.riskType === 'HEAT_STRESS') {
      message = 'HEAT STRESS WARNING: Hyperthermic vital signs detected.';
    } else if (risk.riskType === 'RESPIRATORY_RISK') {
      message = 'RESPIRATORY WARNING: Deteriorating SpO2 under hazardous air quality.';
    }

    const alertData = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      severity,
      type: risk.riskType,
      message,
      reasons: risk.reasons,
      recommendedActions: risk.recommendedActions,
      acknowledged: false,
      timestamp: new Date(),
    };

    // Store in memory cache
    this.memoryAlerts.unshift(alertData);
    if (this.memoryAlerts.length > 50) {
      this.memoryAlerts.pop();
    }

    // Persist to MongoDB if model is available
    try {
      if (this.alertModel) {
        await this.alertModel.create(alertData);
      }
    } catch (err) {
      this.logger.warn(`Failed to persist alert to MongoDB (cached in-memory): ${err.message}`);
    }

    this.logger.log(`Created alert [${severity}]: ${message}`);
    return alertData;
  }

  public async getAlerts(limit = 20): Promise<any[]> {
    try {
      if (this.alertModel) {
        const docs = await this.alertModel
          .find()
          .sort({ timestamp: -1 })
          .limit(limit)
          .lean()
          .exec();
        if (docs && docs.length > 0) {
          return docs.map((doc: any) => ({
            id: doc._id?.toString() || doc.id,
            ...doc,
          }));
        }
      }
    } catch (err) {
      this.logger.warn(`MongoDB query failed, serving from memory cache: ${err.message}`);
    }
    return this.memoryAlerts.slice(0, limit);
  }

  public async getRecentAlerts(): Promise<any[]> {
    return this.getAlerts(5);
  }

  public async getAlertsCount(): Promise<{ total: number; cnt: number; unacknowledged: number }> {
    let total = this.memoryAlerts.length;
    let unacknowledged = this.memoryAlerts.filter((a) => !a.acknowledged).length;

    try {
      if (this.alertModel) {
        total = await this.alertModel.countDocuments().exec();
        unacknowledged = await this.alertModel.countDocuments({ acknowledged: false }).exec();
      }
    } catch (err: any) {
      this.logger.warn(`MongoDB countDocuments failed, using in-memory count: ${err.message}`);
    }

    return { total, cnt: total, unacknowledged };
  }

  public async createCustomAlert(data: {
    message: string;
    severity?: 'INFO' | 'WARNING' | 'CRITICAL';
    type?: string;
    reasons?: string[];
    recommendedActions?: string[];
  }): Promise<any> {
    const alertData = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: 'demo_user_anonymous',
      severity: data.severity || 'WARNING',
      type: data.type || 'MANUAL_ALERT',
      message: data.message,
      reasons: data.reasons || ['Manual alert initiated by operator'],
      recommendedActions: data.recommendedActions || ['Inspect patient condition immediately'],
      acknowledged: false,
      timestamp: new Date(),
    };

    this.memoryAlerts.unshift(alertData);
    if (this.memoryAlerts.length > 100) this.memoryAlerts.pop();

    try {
      if (this.alertModel) {
        await this.alertModel.create(alertData);
      }
    } catch (err: any) {
      this.logger.warn(`MongoDB alert creation fallback: ${err.message}`);
    }

    return alertData;
  }

  public async deleteAlert(id: string): Promise<boolean> {
    const initialLen = this.memoryAlerts.length;
    this.memoryAlerts = this.memoryAlerts.filter((a) => a.id !== id);

    try {
      if (this.alertModel) {
        const filter = Types.ObjectId.isValid(id) ? { $or: [{ _id: id }, { id }] } : { id };
        await this.alertModel.deleteOne(filter as any).exec();
      }
      return true;
    } catch (err: any) {
      this.logger.warn(`MongoDB delete error: ${err.message}`);
      return this.memoryAlerts.length < initialLen;
    }
  }

  public async acknowledgeAlert(id: string): Promise<boolean> {
    // Update in-memory
    const memIndex = this.memoryAlerts.findIndex((a) => a.id === id);
    if (memIndex >= 0) {
      this.memoryAlerts[memIndex].acknowledged = true;
    }

    // Update in Mongo
    try {
      if (this.alertModel) {
        const filter = Types.ObjectId.isValid(id) ? { $or: [{ _id: id }, { id }] } : { id };
        await this.alertModel.updateOne(
          filter as any,
          { $set: { acknowledged: true, acknowledgedAt: new Date() } },
        );
      }
      return true;
    } catch (err) {
      this.logger.warn(`MongoDB acknowledge error: ${err.message}`);
      return true;
    }
  }
}

