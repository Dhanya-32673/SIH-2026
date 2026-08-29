import { Controller, Get, Query } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('api/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('latest')
  getLatest() {
    return {
      success: true,
      data: this.healthService.getLatest(),
    };
  }

  @Get('history')
  getHistory(@Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 60;
    return {
      success: true,
      data: this.healthService.getHistory(lim),
    };
  }
}
