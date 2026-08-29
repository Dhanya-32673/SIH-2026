import { Injectable, Logger } from '@nestjs/common';
import {
  DemoScenario,
  DisasterMode,
  IEnvironmentMetrics,
  IHealthMetrics,
  IMotionMetrics,
  ITelemetryPayload,
} from '../common/interfaces/telemetry.interface';

@Injectable()
export class SensorSimulatorService {
  private readonly logger = new Logger(SensorSimulatorService.name);

  // Current active scenario and mode
  private currentScenario: DemoScenario = 'NORMAL';
  private currentDisasterMode: DisasterMode = 'NORMAL';
  private scenarioStepCount = 0;

  // Internal smooth state trackers
  private currentHR = 76.0;
  private currentSpO2 = 98.2;
  private currentBodyTemp = 36.7;
  private currentEnvTemp = 26.5;
  private currentHumidity = 48.0;
  private currentPressure = 1013.2;
  private currentAQI = 38.0;
  private currentPM25 = 12.4;
  private currentAcceleration = 1.0;
  private currentOrientation: IMotionMetrics['orientation'] = 'Standing';
  private fallDetected = false;
  private inactivitySeconds = 0;

  // Target targets per scenario
  private readonly scenarioTargets: Record<
    DemoScenario,
    {
      hr: number;
      spo2: number;
      bodyTemp: number;
      envTemp: number;
      humidity: number;
      aqi: number;
      pm25: number;
      activity: IHealthMetrics['activity'];
    }
  > = {
    NORMAL: {
      hr: 74,
      spo2: 98.5,
      bodyTemp: 36.7,
      envTemp: 25.0,
      humidity: 50.0,
      aqi: 35,
      pm25: 12.0,
      activity: 'Normal',
    },
    HEAT_STRESS: {
      hr: 132,
      spo2: 96.0,
      bodyTemp: 39.4,
      envTemp: 44.5,
      humidity: 78.0,
      aqi: 85,
      pm25: 35.0,
      activity: 'High',
    },
    POLLUTION: {
      hr: 98,
      spo2: 91.5,
      bodyTemp: 37.1,
      envTemp: 29.0,
      humidity: 62.0,
      aqi: 380,
      pm25: 220.0,
      activity: 'Moderate',
    },
    FALL: {
      hr: 115,
      spo2: 96.5,
      bodyTemp: 36.8,
      envTemp: 26.0,
      humidity: 52.0,
      aqi: 42,
      pm25: 15.0,
      activity: 'Impact/Fall',
    },
    CRITICAL: {
      hr: 154,
      spo2: 86.5,
      bodyTemp: 40.3,
      envTemp: 43.0,
      humidity: 82.0,
      aqi: 395,
      pm25: 245.0,
      activity: 'Impact/Fall',
    },
  };

  constructor() {
    this.logger.log('SensorSimulatorService initialized with scenario: NORMAL');
  }

  public setScenario(scenario: DemoScenario): void {
    this.logger.log(`Switching simulation scenario to: ${scenario}`);
    this.currentScenario = scenario;
    this.scenarioStepCount = 0;

    if (scenario === 'FALL') {
      // Simulate impact spike immediately
      this.currentAcceleration = 4.2;
      this.currentOrientation = 'Sudden Drop';
      this.fallDetected = true;
      this.inactivitySeconds = 0;
    } else {
      this.fallDetected = false;
      this.currentAcceleration = 1.0;
      this.currentOrientation = 'Standing';
      this.inactivitySeconds = 0;
    }
  }

  public getScenario(): DemoScenario {
    return this.currentScenario;
  }

  public setDisasterMode(mode: DisasterMode): void {
    this.logger.log(`Switching disaster mode to: ${mode}`);
    this.currentDisasterMode = mode;
  }

  public getDisasterMode(): DisasterMode {
    return this.currentDisasterMode;
  }

  /**
   * Generates a single tick of realistic physiological & environmental telemetry.
   */
  public generateNextTick(): {
    health: IHealthMetrics;
    environment: IEnvironmentMetrics;
    motion: IMotionMetrics;
  } {
    this.scenarioStepCount++;
    const target = this.scenarioTargets[this.currentScenario];

    // Smooth convergence toward target (alpha = 0.15 for organic inertia)
    const alpha = this.currentScenario === 'FALL' ? 0.4 : 0.18;

    // Add organic physiological noise (Brownian micro-fluctuations)
    const noiseHR = (Math.random() - 0.5) * 1.8;
    const noiseSpO2 = (Math.random() - 0.5) * 0.3;
    const noiseBodyTemp = (Math.random() - 0.5) * 0.05;
    const noiseEnvTemp = (Math.random() - 0.5) * 0.15;
    const noiseHumidity = (Math.random() - 0.5) * 0.4;
    const noiseAQI = (Math.random() - 0.5) * 2.5;

    const prevHR = this.currentHR;
    const prevTemp = this.currentBodyTemp;
    const prevSpO2 = this.currentSpO2;

    this.currentHR = this.currentHR + (target.hr - this.currentHR) * alpha + noiseHR;
    this.currentSpO2 = Math.min(
      100,
      Math.max(75, this.currentSpO2 + (target.spo2 - this.currentSpO2) * alpha + noiseSpO2),
    );
    this.currentBodyTemp =
      this.currentBodyTemp + (target.bodyTemp - this.currentBodyTemp) * alpha + noiseBodyTemp;
    this.currentEnvTemp =
      this.currentEnvTemp + (target.envTemp - this.currentEnvTemp) * alpha + noiseEnvTemp;
    this.currentHumidity = Math.min(
      99,
      Math.max(20, this.currentHumidity + (target.humidity - this.currentHumidity) * alpha + noiseHumidity),
    );
    this.currentAQI = Math.max(
      10,
      this.currentAQI + (target.aqi - this.currentAQI) * alpha + noiseAQI,
    );
    this.currentPM25 = Math.max(
      2,
      this.currentPM25 + (target.pm25 - this.currentPM25) * alpha + noiseAQI * 0.4,
    );

    // Fall scenario physics progression
    if (this.currentScenario === 'FALL') {
      if (this.scenarioStepCount === 1) {
        this.currentAcceleration = 4.3;
        this.currentOrientation = 'Sudden Drop';
      } else if (this.scenarioStepCount === 2) {
        this.currentAcceleration = 0.2; // brief freefall / impact settling
        this.currentOrientation = 'Lying Down';
      } else {
        this.currentAcceleration = 0.98 + (Math.random() - 0.5) * 0.04;
        this.currentOrientation = 'Lying Down';
        this.inactivitySeconds += 1;
      }
    } else {
      this.currentAcceleration = 1.0 + (Math.random() - 0.5) * 0.08;
    }

    // Compute NOAA Heat Index
    const heatIndex = this.calculateHeatIndex(this.currentEnvTemp, this.currentHumidity);

    // Determine Air Quality categorization
    let aqiStatus: 'GOOD' | 'MODERATE' | 'POOR' | 'HAZARDOUS' = 'GOOD';
    if (this.currentAQI > 300) aqiStatus = 'HAZARDOUS';
    else if (this.currentAQI > 150) aqiStatus = 'POOR';
    else if (this.currentAQI > 50) aqiStatus = 'MODERATE';

    // Activity state
    let activityState: IHealthMetrics['activity'] = target.activity;
    if (this.currentScenario === 'NORMAL') {
      activityState = this.scenarioStepCount % 12 > 7 ? 'Normal' : 'Resting';
    }

    // Trends
    const hrTrend = this.currentHR > prevHR + 0.3 ? 'UP' : this.currentHR < prevHR - 0.3 ? 'DOWN' : 'STABLE';
    const tempTrend =
      this.currentBodyTemp > prevTemp + 0.05
        ? 'UP'
        : this.currentBodyTemp < prevTemp - 0.05
          ? 'DOWN'
          : 'STABLE';
    const spo2Trend =
      this.currentSpO2 > prevSpO2 + 0.2
        ? 'UP'
        : this.currentSpO2 < prevSpO2 - 0.2
          ? 'DOWN'
          : 'STABLE';

    // Synthetic PPG waveform chunk (12 samples per second for high-res pulse wave rendering)
    const ppgWaveform = this.generatePPGWave(this.currentHR);

    return {
      health: {
        heartRate: Math.round(this.currentHR),
        spo2: Number(this.currentSpO2.toFixed(1)),
        bodyTemperature: Number(this.currentBodyTemp.toFixed(1)),
        activity: activityState,
        ppgWaveform,
        hrTrend,
        tempTrend,
        spo2Trend,
      },
      environment: {
        temperature: Number(this.currentEnvTemp.toFixed(1)),
        humidity: Math.round(this.currentHumidity),
        pressure: Number(this.currentPressure.toFixed(1)),
        airQuality: {
          aqi: Math.round(this.currentAQI),
          pm25: Number(this.currentPM25.toFixed(1)),
          status: aqiStatus,
        },
        heatIndex: Number(heatIndex.toFixed(1)),
      },
      motion: {
        acceleration: Number(this.currentAcceleration.toFixed(2)),
        orientation: this.currentOrientation,
        fallDetected: this.fallDetected,
        inactivityTimer: this.inactivitySeconds,
      },
    };
  }

  /**
   * NOAA Heat Index approximation formula (°C)
   */
  private calculateHeatIndex(tempC: number, rh: number): number {
    if (tempC < 27) return tempC;
    // Convert to Fahrenheit for standard NOAA formula
    const T = (tempC * 9) / 5 + 32;
    const R = rh;
    const hiF =
      -42.379 +
      2.04901523 * T +
      10.14333127 * R -
      0.22475541 * T * R -
      0.00683783 * T * T -
      0.05481717 * R * R +
      0.00122874 * T * T * R +
      0.00085282 * T * R * R -
      0.00000199 * T * T * R * R;
    return ((hiF - 32) * 5) / 9;
  }

  /**
   * Generates a 12-sample synthetic photoplethysmogram (PPG) pulse wave chunk
   */
  private generatePPGWave(bpm: number): number[] {
    const samples: number[] = [];
    const freq = bpm / 60; // beats per second
    const timeNow = Date.now() / 1000;
    for (let i = 0; i < 12; i++) {
      const t = timeNow + i * (1 / 12);
      const phase = (t * freq * 2 * Math.PI) % (2 * Math.PI);
      // Realistic PPG dicrotic notch curve
      const systolic = Math.exp(-Math.pow(phase - 1.2, 2) / 0.35);
      const dicrotic = 0.35 * Math.exp(-Math.pow(phase - 2.8, 2) / 0.45);
      const val = Math.max(0, systolic + dicrotic);
      samples.push(Number(val.toFixed(3)));
    }
    return samples;
  }
}
