import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

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

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-email-otp')
  async sendEmailOtp(@Body() body: SendEmailOtpDto) {
    return this.authService.sendEmailOtp(body.email);
  }

  @Post('verify-email-otp')
  async verifyEmailOtp(@Body() body: VerifyEmailOtpDto) {
    const result = this.authService.verifyEmailOtp(body.email, body.otp);
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return result;
  }

  @Post('send-phone-otp')
  async sendPhoneOtp(@Body() body: SendPhoneOtpDto) {
    return this.authService.sendPhoneOtp(body.phoneNumber);
  }

  @Post('verify-phone-otp')
  async verifyPhoneOtp(@Body() body: VerifyPhoneOtpDto) {
    const result = this.authService.verifyPhoneOtp(body.phoneNumber, body.otp);
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return result;
  }
}
