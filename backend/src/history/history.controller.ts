import { Controller, Get, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('api/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  getHistory(@Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 60;
    return this.historyService.getHistory(lim);
  }
}
