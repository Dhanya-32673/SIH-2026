import { Controller, Get, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('api/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('cnt')
  getHistoryCnt() {
    return this.getHistoryCount();
  }

  @Get('count')
  getHistoryCount() {
    const history = this.historyService.getHistory(60);
    return {
      success: true,
      count: history.points,
      cnt: history.points,
      points: history.points,
    };
  }

  @Get()
  getHistory(
    @Query('limit') limit?: string,
    @Query('cnt') cnt?: string,
    @Query('count') count?: string,
  ) {
    const rawLimit = limit || cnt || count;
    const lim = rawLimit ? parseInt(rawLimit, 10) : 60;
    return this.historyService.getHistory(lim);
  }
}
