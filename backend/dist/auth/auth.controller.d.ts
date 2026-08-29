import { AuthService } from './auth.service';
declare class SendEmailOtpDto {
    email: string;
}
declare class VerifyEmailOtpDto {
    email: string;
    otp: string;
}
declare class SendPhoneOtpDto {
    phoneNumber: string;
}
declare class VerifyPhoneOtpDto {
    phoneNumber: string;
    otp: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendEmailOtp(body: SendEmailOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyEmailOtp(body: VerifyEmailOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    sendPhoneOtp(body: SendPhoneOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyPhoneOtp(body: VerifyPhoneOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
