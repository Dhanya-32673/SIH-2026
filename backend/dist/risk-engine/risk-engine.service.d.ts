import { DisasterMode, IEnvironmentMetrics, IHealthMetrics, IMotionMetrics, IRiskAssessment } from '../common/interfaces/telemetry.interface';
export interface IRiskEngine {
    analyze(health: IHealthMetrics, environment: IEnvironmentMetrics, motion: IMotionMetrics, disasterMode?: DisasterMode): IRiskAssessment;
}
export declare class RiskEngineService implements IRiskEngine {
    private readonly logger;
    private readonly DISCLAIMER;
    analyze(health: IHealthMetrics, environment: IEnvironmentMetrics, motion: IMotionMetrics, disasterMode?: DisasterMode): IRiskAssessment;
}
