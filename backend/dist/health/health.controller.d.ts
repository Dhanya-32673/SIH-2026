import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getLatest(): {
        success: boolean;
        data: import("../common/interfaces/telemetry.interface").IHealthMetrics;
    };
    getHistory(limit?: string): {
        success: boolean;
        data: (import("../common/interfaces/telemetry.interface").IHealthMetrics & {
            timestamp: Date;
        })[];
    };
}
