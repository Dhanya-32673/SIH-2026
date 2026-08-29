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
  heartRate: number;
  spo2: number;
  bodyTemperature: number;
  activity: 'Resting' | 'Normal' | 'Moderate' | 'High' | 'Impact/Fall';
  ppgWaveform?: number[];
  hrTrend: 'UP' | 'DOWN' | 'STABLE';
  tempTrend: 'UP' | 'DOWN' | 'STABLE';
  spo2Trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface IEnvironmentMetrics {
  temperature: number;
  humidity: number;
  pressure: number;
  airQuality: {
    aqi: number;
    pm25: number;
    status: 'GOOD' | 'MODERATE' | 'POOR' | 'HAZARDOUS';
  };
  heatIndex: number;
}

export interface IMotionMetrics {
  acceleration: number;
  orientation: 'Standing' | 'Sitting' | 'Lying Down' | 'Sudden Drop';
  fallDetected: boolean;
  inactivityTimer: number;
}

export interface IRiskFactorBreakdown {
  temperatureRisk: number;
  heartRateRisk: number;
  spo2Risk: number;
  environmentRisk: number;
  activityRisk: number;
  fallRisk: number;
}

export interface IRiskAssessment {
  status: RiskStatus;
  riskType: RiskType;
  riskScore: number;
  confidence: number;
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

export interface IAlertItem {
  id: string;
  userId: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  type: string;
  message: string;
  reasons: string[];
  recommendedActions: string[];
  acknowledged: boolean;
  timestamp: string;
}

export interface IEmergencyEvent {
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
  triggeredAt: string;
  resolvedAt?: string;
  escalatedAt?: string;
}
