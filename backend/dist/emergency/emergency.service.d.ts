import { Model } from 'mongoose';
import { EmergencyEventDocument } from '../database/schemas/emergency-event.schema';
import { IRiskAssessment } from '../common/interfaces/telemetry.interface';
export declare class EmergencyService {
    private readonly emergencyModel?;
    private readonly logger;
    private activeEmergency;
    constructor(emergencyModel?: Model<EmergencyEventDocument>);
    getActiveEmergency(): {
        id: string;
        userId: string;
        riskType: string;
        state: "DETECTED" | "COUNTDOWN" | "USER_CONFIRMED_SAFE" | "ESCALATED";
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
    };
    triggerEmergency(userId: string, risk: IRiskAssessment, snapshotTelemetry?: Record<string, any>): {
        id: string;
        userId: string;
        riskType: string;
        state: "DETECTED" | "COUNTDOWN" | "USER_CONFIRMED_SAFE" | "ESCALATED";
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
    };
    respondToEmergency(action: 'SAFE' | 'NEED_HELP', userId?: string): Promise<{
        success: boolean;
        message: string;
        state: string;
        emergency?: undefined;
    } | {
        success: boolean;
        message: string;
        emergency: {
            id: string;
            userId: string;
            riskType: string;
            state: "DETECTED" | "COUNTDOWN" | "USER_CONFIRMED_SAFE" | "ESCALATED";
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
        };
        state?: undefined;
    }>;
    decrementCountdown(): number;
    clearEmergency(): void;
}
