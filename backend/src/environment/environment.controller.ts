import { Controller, Get, Query } from '@nestjs/common';
import { EnvironmentService } from './environment.service';

@Controller('api/environment')
export class EnvironmentController {
  constructor(private readonly envService: EnvironmentService) {}

  @Get('latest')
  getLatest() {
    return {
      success: true,
      data: this.envService.getLatest(),
    };
  }

  @Get('count')
  @Get('cnt')
  getCount() {
    return {
      success: true,
      count: 1,
      cnt: 1,
      data: { activeSensors: 5, telemetryRateHz: 1 },
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
    const history = this.envService.getHistory(lim);
    return {
      success: true,
      count: history.length,
      cnt: history.length,
      data: history,
    };
  }
}
