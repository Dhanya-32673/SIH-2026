import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import { AlertsService } from './alerts/alerts.service';

@Controller()
export class AppController {
  constructor(private readonly alertsService: AlertsService) {}

  @Public()
  @Get()
  getRoot() {
    return {
      status: 'ok',
      service: 'AI Health Companion API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('api/health-check')
  getHealthCheck() {
    return {
      status: 'ok',
      service: 'AI Health Companion API',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('api/cnt')
  async getSystemCnt() {
    return this.getSystemCounts();
  }

  @Public()
  @Get('api/count')
  async getSystemCounts() {
    const alertCounts = await this.alertsService.getAlertsCount();
    return {
      success: true,
      status: 'ok',
      count: alertCounts.total,
      cnt: alertCounts.total,
      unacknowledgedAlerts: alertCounts.unacknowledged,
      timestamp: new Date().toISOString(),
    };
  }
}
