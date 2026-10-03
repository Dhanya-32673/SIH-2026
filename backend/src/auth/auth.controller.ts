import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

class SendEmailOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

class VerifyEmailOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}

class SendPhoneOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format. Must be E.164 standard.' })
  phoneNumber: string;
}

class VerifyPhoneOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format.' })
  phoneNumber: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}

class DirectLoginDto {
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;

  @IsOptional()
  @IsString()
  password?: string;
}

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('send-email-otp')
  async sendEmailOtp(@Body() body: SendEmailOtpDto) {
    return this.authService.sendEmailOtp(body.email);
  }

  @Public()
  @Post('verify-email-otp')
  async verifyEmailOtp(@Body() body: VerifyEmailOtpDto) {
    const result = this.authService.verifyEmailOtp(body.email, body.otp);
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return result;
  }

  @Public()
  @Post('send-phone-otp')
  async sendPhoneOtp(@Body() body: SendPhoneOtpDto) {
    return this.authService.sendPhoneOtp(body.phoneNumber);
  }

  @Public()
  @Post('verify-phone-otp')
  async verifyPhoneOtp(@Body() body: VerifyPhoneOtpDto) {
    const result = this.authService.verifyPhoneOtp(body.phoneNumber, body.otp);
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return result;
  }

  @Public()
  @Post('login')
  async login(@Body() body: DirectLoginDto) {
    return this.authService.loginWithCredentials(body.usernameOrEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    return {
      success: true,
      user: req.user,
      message: 'Authenticated session valid.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verifySession(@Req() req: any) {
    return {
      success: true,
      valid: true,
      user: req.user,
    };
  }
}
