export type RiskStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

export type RiskType =
  | 'NONE'
  | 'HEAT_STRESS'
  | 'RESPIRATORY_RISK'
  | 'FALL_RISK'
  | 'CRITICAL'
  | 'MULTI_PARAMETER_RISK';

export type DisasterMode = 'NORMAL' | 'HEAT_WAVE' | 'POLLUTION' | 'DISASTER';

export type DemoScenario =
  | 'NORMAL'
  | 'HEAT_STRESS'
  | 'POLLUTION'
  | 'FALL'
  | 'CRITICAL';

export interface IHealthMetrics {
  heartRate: number; // BPM
  spo2: number; // %
  bodyTemperature: number; // °C
  activity: 'Resting' | 'Normal' | 'Moderate' | 'High' | 'Impact/Fall';
  ppgWaveform?: number[]; // simulated PPG chunk
  hrTrend: 'UP' | 'DOWN' | 'STABLE';
  tempTrend: 'UP' | 'DOWN' | 'STABLE';
  spo2Trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface IEnvironmentMetrics {
  temperature: number; // °C
  humidity: number; // %
  pressure: number; // hPa
  airQuality: {
    aqi: number;
    pm25: number; // ug/m3
    status: 'GOOD' | 'MODERATE' | 'POOR' | 'HAZARDOUS';
  };
  heatIndex: number; // °C
}

export interface IMotionMetrics {
  acceleration: number; // g-force (normal ~1.0g)
  orientation: 'Standing' | 'Sitting' | 'Lying Down' | 'Sudden Drop';
  fallDetected: boolean;
  inactivityTimer: number; // seconds of immobility after impact
}

export interface IRiskFactorBreakdown {
  temperatureRisk: number; // 0-100
  heartRateRisk: number; // 0-100
  spo2Risk: number; // 0-100
  environmentRisk: number; // 0-100
  activityRisk: number; // 0-100
  fallRisk: number; // 0-100
}

export interface IRiskAssessment {
  status: RiskStatus;
  riskType: RiskType;
  riskScore: number; // 0 - 100
  confidence: number; // 0 - 100 %
  reasons: string[];
  recommendedActions: string[];
  factors: IRiskFactorBreakdown;
  disclaimer: string;
  evaluatedAt: string;
}

export interface ITelemetryPayload {
  timestamp: string;
  userId: string;
  scenario: DemoScenario;
  disasterMode: DisasterMode;
  health: IHealthMetrics;
  environment: IEnvironmentMetrics;
  motion: IMotionMetrics;
  risk: IRiskAssessment;
  batteryLevel?: number;
  deviceStatus?: 'ONLINE' | 'STANDBY' | 'EMERGENCY';
}
