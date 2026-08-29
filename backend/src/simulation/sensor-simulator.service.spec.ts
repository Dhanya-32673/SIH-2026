import { SensorSimulatorService } from './sensor-simulator.service';

describe('SensorSimulatorService', () => {
  let simulator: SensorSimulatorService;

  beforeEach(() => {
    simulator = new SensorSimulatorService();
  });

  it('should initialize with NORMAL scenario', () => {
    expect(simulator.getScenario()).toBe('NORMAL');
    const tick = simulator.generateNextTick();
    expect(tick.health.heartRate).toBeGreaterThan(60);
    expect(tick.health.heartRate).toBeLessThan(95);
    expect(tick.health.spo2).toBeGreaterThan(95);
    expect(tick.environment.airQuality.status).toBe('GOOD');
  });

  it('should transition smoothly when HEAT_STRESS is triggered', () => {
    simulator.setScenario('HEAT_STRESS');
    expect(simulator.getScenario()).toBe('HEAT_STRESS');

    // Run 5 ticks to allow convergence
    let lastTick;
    for (let i = 0; i < 5; i++) {
      lastTick = simulator.generateNextTick();
    }

    expect(lastTick.environment.temperature).toBeGreaterThan(30);
    expect(lastTick.health.heartRate).toBeGreaterThan(85);
  });

  it('should register high acceleration and orientation drop on FALL', () => {
    simulator.setScenario('FALL');
    const tick1 = simulator.generateNextTick();
    expect(tick1.motion.fallDetected).toBe(true);
    expect(tick1.motion.acceleration).toBeGreaterThan(3.5);
  });
});
