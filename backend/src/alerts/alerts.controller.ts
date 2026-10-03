import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('api/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get('cnt')
  async getAlertsCnt() {
    return this.getAlertsCount();
  }

  @Get('count')
  async getAlertsCount() {
    const counts = await this.alertsService.getAlertsCount();
    return {
      success: true,
      count: counts.total,
      cnt: counts.total,
      total: counts.total,
      unacknowledged: counts.unacknowledged,
      data: counts,
    };
  }

  @Get('recent')
  async getRecentAlerts(
    @Query('limit') limit?: string,
    @Query('cnt') cnt?: string,
    @Query('count') count?: string,
  ) {
    const rawLimit = limit || cnt || count;
    const lim = rawLimit ? parseInt(rawLimit, 10) : 5;
    const alerts = await this.alertsService.getAlerts(lim);
    return {
      success: true,
      count: alerts.length,
      cnt: alerts.length,
      total: alerts.length,
      data: alerts,
    };
  }

  @Get()
  async getAlerts(
    @Query('limit') limit?: string,
    @Query('cnt') cnt?: string,
    @Query('count') count?: string,
  ) {
    const rawLimit = limit || cnt || count;
    const lim = rawLimit ? parseInt(rawLimit, 10) : 20;
    const alerts = await this.alertsService.getAlerts(lim);
    return {
      success: true,
      count: alerts.length,
      cnt: alerts.length,
      total: alerts.length,
      data: alerts,
    };
  }

  @Post()
  async createAlert(@Body() body: any) {
    const alert = await this.alertsService.createCustomAlert(body || {});
    return {
      success: true,
      message: 'Alert logged successfully.',
      data: alert,
    };
  }

  @Post(':id/acknowledge')
  @Put(':id/acknowledge')
  async acknowledgeAlert(@Param('id') id: string) {
    const success = await this.alertsService.acknowledgeAlert(id);
    return { success, message: 'Alert successfully acknowledged.' };
  }

  @Delete(':id')
  async deleteAlert(@Param('id') id: string) {
    const success = await this.alertsService.deleteAlert(id);
    return { success, message: `Alert ${id} deleted successfully.` };
  }
}
