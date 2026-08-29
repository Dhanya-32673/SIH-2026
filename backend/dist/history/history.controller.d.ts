import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    getHistory(limit?: string): {
        success: boolean;
        points: number;
        data: {
            timestamp: string;
            heartRate: number;
            spo2: number;
            bodyTemperature: number;
            envTemperature: number;
            humidity: number;
            aqi: number;
            riskScore: number;
            status: string;
        }[];
    };
}
