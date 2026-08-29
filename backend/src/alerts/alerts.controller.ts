import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('api/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async getAlerts(@Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 20;
    const alerts = await this.alertsService.getAlerts(lim);
    return { success: true, count: alerts.length, data: alerts };
  }

  @Get('recent')
  async getRecentAlerts() {
    const alerts = await this.alertsService.getRecentAlerts();
    return { success: true, count: alerts.length, data: alerts };
  }

  @Post(':id/acknowledge')
  async acknowledgeAlert(@Param('id') id: string) {
    const success = await this.alertsService.acknowledgeAlert(id);
    return { success, message: 'Alert successfully acknowledged.' };
  }
}
