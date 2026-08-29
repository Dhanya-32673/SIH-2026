import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SensorSimulatorService } from '../simulation/sensor-simulator.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { AlertsService } from '../alerts/alerts.service';
import { EmergencyService } from '../emergency/emergency.service';
import { HealthService } from '../health/health.service';
import { EnvironmentService } from '../environment/environment.service';
import {
  DemoScenario,
  DisasterMode,
  ITelemetryPayload,
} from '../common/interfaces/telemetry.interface';

@WebSocketGateway({
  namespace: '/health',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class HealthGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(HealthGateway.name);
  private timer: NodeJS.Timeout | null = null;
  private tickCounter = 0;

  constructor(
    private readonly simulator: SensorSimulatorService,
    private readonly riskEngine: RiskEngineService,
    private readonly alertsService: AlertsService,
    private readonly emergencyService: EmergencyService,
    private readonly healthService: HealthService,
    private readonly envService: EnvironmentService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('HealthGateway Socket.IO initialized on namespace /health');
    this.startStreamingLoop();
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Immediately send current state snapshot
    const tick = this.generateCurrentPayload();
    client.emit('telemetry', tick);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private startStreamingLoop() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(async () => {
      try {
        const payload = this.generateCurrentPayload();
        this.tickCounter++;

        // Update in-memory services
        this.healthService.updateLatest(payload.health);
        this.envService.updateLatest(payload.environment);

        // Periodically persist to MongoDB (every 5 seconds) to avoid database thrashing
        if (this.tickCounter % 5 === 0) {
          this.healthService.persistReading(payload.health, payload.userId);
          this.envService.persistReading(payload.environment, payload.userId);
        }

        // Evaluate alert generation
        const newAlert = await this.alertsService.evaluateAndCreateAlert(
          payload.userId,
          payload.risk,
        );
        if (newAlert) {
          this.server.emit('alert', newAlert);
        }

        // Evaluate emergency state
        if (payload.risk.status === 'CRITICAL' || payload.motion.fallDetected) {
          const emergency = this.emergencyService.triggerEmergency(
            payload.userId,
            payload.risk,
          );
          if (emergency) {
            this.emergencyService.decrementCountdown();
            this.server.emit('emergency', emergency);
          }
        } else {
          // If no critical risk and emergency was not manually held, check countdown
          const activeEmerg = this.emergencyService.getActiveEmergency();
          if (activeEmerg && activeEmerg.state === 'COUNTDOWN') {
            this.emergencyService.decrementCountdown();
            this.server.emit('emergency', activeEmerg);
          }
        }

        // Broadcast telemetry to all connected clients
        this.server.emit('telemetry', payload);
      } catch (err) {
        this.logger.error(`Error in streaming tick loop: ${err.message}`);
      }
    }, 1000);
  }

  private generateCurrentPayload(): ITelemetryPayload {
    const rawTick = this.simulator.generateNextTick();
    const scenario = this.simulator.getScenario();
    const disasterMode = this.simulator.getDisasterMode();

    const risk = this.riskEngine.analyze(
      rawTick.health,
      rawTick.environment,
      rawTick.motion,
      disasterMode,
    );

    return {
      timestamp: new Date().toISOString(),
      userId: 'demo_user_anonymous',
      scenario,
      disasterMode,
      health: rawTick.health,
      environment: rawTick.environment,
      motion: rawTick.motion,
      risk,
      batteryLevel: 94,
      deviceStatus: risk.status === 'CRITICAL' ? 'EMERGENCY' : 'ONLINE',
    };
  }

  @SubscribeMessage('set_scenario')
  handleSetScenario(
    @MessageBody() data: { scenario: DemoScenario },
    @ConnectedSocket() client: Socket,
  ) {
    if (data?.scenario) {
      this.simulator.setScenario(data.scenario);
      const immediatePayload = this.generateCurrentPayload();
      this.server.emit('telemetry', immediatePayload);
      return { success: true, scenario: data.scenario };
    }
  }

  @SubscribeMessage('set_disaster_mode')
  handleSetDisasterMode(
    @MessageBody() data: { mode: DisasterMode },
    @ConnectedSocket() client: Socket,
  ) {
    if (data?.mode) {
      this.simulator.setDisasterMode(data.mode);
      const immediatePayload = this.generateCurrentPayload();
      this.server.emit('telemetry', immediatePayload);
      return { success: true, mode: data.mode };
    }
  }

  @SubscribeMessage('emergency_response')
  async handleEmergencyResponse(
    @MessageBody() data: { action: 'SAFE' | 'NEED_HELP' },
  ) {
    const result = await this.emergencyService.respondToEmergency(data.action);
    this.server.emit('emergency', result.emergency || null);
    return result;
  }

  @SubscribeMessage('acknowledge_alert')
  async handleAcknowledgeAlert(@MessageBody() data: { id: string }) {
    if (data?.id) {
      await this.alertsService.acknowledgeAlert(data.id);
      this.server.emit('alert_acknowledged', { id: data.id });
      return { success: true, id: data.id };
    }
  }
}
