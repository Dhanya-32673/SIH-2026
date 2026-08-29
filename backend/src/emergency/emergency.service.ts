import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmergencyEvent, EmergencyEventDocument } from '../database/schemas/emergency-event.schema';
import { IRiskAssessment } from '../common/interfaces/telemetry.interface';

@Injectable()
export class EmergencyService {
  private readonly logger = new Logger(EmergencyService.name);

  private activeEmergency: {
    id: string;
    userId: string;
    riskType: string;
    state: 'DETECTED' | 'COUNTDOWN' | 'USER_CONFIRMED_SAFE' | 'ESCALATED';
    countdownRemaining: number;
    triggerFactors: string[];
    simulatedLocation: {
      latitude: number;
      longitude: number;
      accuracy: string;
      label: string;
    };
    triggeredAt: Date;
    resolvedAt?: Date;
    escalatedAt?: Date;
  } | null = null;

  constructor(
    @InjectModel(EmergencyEvent.name)
    private readonly emergencyModel?: Model<EmergencyEventDocument>,
  ) {}

  public getActiveEmergency() {
    return this.activeEmergency;
  }

  public triggerEmergency(
    userId: string,
    risk: IRiskAssessment,
    snapshotTelemetry?: Record<string, any>,
  ) {
    if (this.activeEmergency && this.activeEmergency.state === 'COUNTDOWN') {
      return this.activeEmergency;
    }

    const eventId = `emerg-${Date.now()}`;
    this.activeEmergency = {
      id: eventId,
      userId,
      riskType: risk.riskType,
      state: 'COUNTDOWN',
      countdownRemaining: 10,
      triggerFactors: risk.reasons,
      simulatedLocation: {
        latitude: 16.4419,
        longitude: 80.6222,
        accuracy: '4.8 meters (GNSS L1/L5 Simulation)',
        label: 'SIH Hackathon Control Center, Tech Zone 4, AP, India',
      },
      triggeredAt: new Date(),
    };

    this.logger.warn(`EMERGENCY INITIATED [${risk.riskType}] - 10s Countdown Started.`);
    return this.activeEmergency;
  }

  public async respondToEmergency(
    action: 'SAFE' | 'NEED_HELP',
    userId = 'demo_user_anonymous',
  ) {
    if (!this.activeEmergency) {
      // If no active emergency, still return success
      return {
        success: true,
        message: 'No active emergency in progress.',
        state: 'NORMAL',
      };
    }

    if (action === 'SAFE') {
      this.activeEmergency.state = 'USER_CONFIRMED_SAFE';
      this.activeEmergency.resolvedAt = new Date();
      this.logger.log('Emergency dismissed: User confirmed safe.');

      try {
        if (this.emergencyModel) {
          await this.emergencyModel.create(this.activeEmergency);
        }
      } catch (e) {
        // memory fallback
      }

      const copy = { ...this.activeEmergency };
      setTimeout(() => {
        if (this.activeEmergency?.state === 'USER_CONFIRMED_SAFE') {
          this.activeEmergency = null;
        }
      }, 3000);

      return {
        success: true,
        message: 'Emergency dismissed: User confirmed safe.',
        emergency: copy,
      };
    } else {
      this.activeEmergency.state = 'ESCALATED';
      this.activeEmergency.escalatedAt = new Date();
      this.logger.warn('Emergency escalated: Simulated SOS dispatch beacon broadcasted.');

      try {
        if (this.emergencyModel) {
          await this.emergencyModel.create(this.activeEmergency);
        }
      } catch (e) {
        // memory fallback
      }

      return {
        success: true,
        message: 'Emergency escalation simulated. Distress telemetry packet compiled.',
        emergency: this.activeEmergency,
      };
    }
  }

  public decrementCountdown(): number {
    if (!this.activeEmergency || this.activeEmergency.state !== 'COUNTDOWN') {
      return 0;
    }
    this.activeEmergency.countdownRemaining = Math.max(
      0,
      this.activeEmergency.countdownRemaining - 1,
    );
    if (this.activeEmergency.countdownRemaining === 0) {
      this.activeEmergency.state = 'ESCALATED';
      this.activeEmergency.escalatedAt = new Date();
      this.logger.warn('Countdown expired: Emergency automatically escalated (Simulated).');
    }
    return this.activeEmergency.countdownRemaining;
  }

  public clearEmergency() {
    this.activeEmergency = null;
  }
}
