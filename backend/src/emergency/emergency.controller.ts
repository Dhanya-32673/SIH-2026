import { Controller, Get, Post, Body } from '@nestjs/common';
import { EmergencyService } from './emergency.service';

@Controller('api/emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Get('status')
  getStatus() {
    const emergency = this.emergencyService.getActiveEmergency();
    return {
      success: true,
      active: !!emergency && emergency.state !== 'USER_CONFIRMED_SAFE',
      data: emergency,
    };
  }

  @Post('respond')
  async respond(@Body() body: { action: 'SAFE' | 'NEED_HELP'; userId?: string }) {
    const result = await this.emergencyService.respondToEmergency(
      body.action,
      body.userId,
    );
    return result;
  }

  @Post('clear')
  clear() {
    this.emergencyService.clearEmergency();
    return { success: true, message: 'Emergency state cleared.' };
  }
}
