import { DemoService } from './demo.service';
import { DemoScenario, DisasterMode } from '../common/interfaces/telemetry.interface';
export declare class DemoController {
    private readonly demoService;
    constructor(demoService: DemoService);
    getCurrent(): {
        success: boolean;
        scenario: DemoScenario;
        disasterMode: DisasterMode;
        availableScenarios: string[];
        availableDisasterModes: string[];
    };
    setScenario(body: {
        scenario: DemoScenario;
    }): {
        success: boolean;
        currentScenario: DemoScenario;
        message: string;
    };
    setDisasterMode(body: {
        mode: DisasterMode;
    }): {
        success: boolean;
        currentDisasterMode: DisasterMode;
        message: string;
    };
}
