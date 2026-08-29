import { AlertsService } from './alerts.service';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    getAlerts(limit?: string): Promise<{
        success: boolean;
        count: number;
        data: any[];
    }>;
    getRecentAlerts(): Promise<{
        success: boolean;
        count: number;
        data: any[];
    }>;
    acknowledgeAlert(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
