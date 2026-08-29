import { EmergencyService } from './emergency.service';
export declare class EmergencyController {
    private readonly emergencyService;
    constructor(emergencyService: EmergencyService);
    getStatus(): {
        success: boolean;
        active: boolean;
        data: {
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
    };
    respond(body: {
        action: 'SAFE' | 'NEED_HELP';
        userId?: string;
    }): Promise<{
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
    clear(): {
        success: boolean;
        message: string;
    };
}
