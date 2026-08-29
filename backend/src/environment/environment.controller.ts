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

  @Get('history')
  getHistory(@Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 60;
    return {
      success: true,
      data: this.envService.getHistory(lim),
    };
  }
}
