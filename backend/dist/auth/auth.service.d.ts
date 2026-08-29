import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly configService;
    private readonly logger;
    private emailOtps;
    private phoneOtps;
    private transporter;
    constructor(configService: ConfigService);
    private initMailTransporter;
    private generate6DigitOtp;
    sendEmailOtp(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyEmailOtp(email: string, otp: string): {
        success: boolean;
        message: string;
    };
    sendPhoneOtp(phoneNumber: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyPhoneOtp(phoneNumber: string, otp: string): {
        success: boolean;
        message: string;
    };
}
