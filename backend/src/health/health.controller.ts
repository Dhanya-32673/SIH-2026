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

  @Get('count')
  @Get('cnt')
  getCount() {
    return {
      success: true,
      count: 1,
      cnt: 1,
      data: { activeSensors: 4, telemetryRateHz: 1 },
    };
  }

  @Get('history')
  getHistory(
    @Query('limit') limit?: string,
    @Query('cnt') cnt?: string,
    @Query('count') count?: string,
  ) {
    const rawLimit = limit || cnt || count;
    const lim = rawLimit ? parseInt(rawLimit, 10) : 60;
    const history = this.healthService.getHistory(lim);
    return {
      success: true,
      count: history.length,
      cnt: history.length,
      data: history,
    };
  }
}
