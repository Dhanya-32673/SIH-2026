import { Controller, Get, Post, Body } from '@nestjs/common';
import { DemoService } from './demo.service';
import { DemoScenario, DisasterMode } from '../common/interfaces/telemetry.interface';

@Controller('api/demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get('current')
  getCurrent() {
    return this.demoService.getCurrentStatus();
  }

  @Post('scenario')
  setScenario(@Body() body: { scenario: DemoScenario }) {
    return this.demoService.setScenario(body.scenario || 'NORMAL');
  }

  @Post('disaster-mode')
  setDisasterMode(@Body() body: { mode: DisasterMode }) {
    return this.demoService.setDisasterMode(body.mode || 'NORMAL');
  }
}
