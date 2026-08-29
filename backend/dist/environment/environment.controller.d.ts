import { EnvironmentService } from './environment.service';
export declare class EnvironmentController {
    private readonly envService;
    constructor(envService: EnvironmentService);
    getLatest(): {
        success: boolean;
        data: import("../common/interfaces/telemetry.interface").IEnvironmentMetrics;
    };
    getHistory(limit?: string): {
        success: boolean;
        data: (import("../common/interfaces/telemetry.interface").IEnvironmentMetrics & {
            timestamp: Date;
        })[];
    };
}
