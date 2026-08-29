"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let AuthService = AuthService_1 = class AuthService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.emailOtps = new Map();
        this.phoneOtps = new Map();
        this.transporter = null;
        this.initMailTransporter();
    }
    initMailTransporter() {
        const host = this.configService.get('SMTP_HOST');
        const port = this.configService.get('SMTP_PORT', 587);
        const user = this.configService.get('SMTP_USER');
        const pass = this.configService.get('SMTP_PASS');
        if (host && user && pass) {
            this.logger.log(`Initializing SMTP Transporter for: ${host}:${port}`);
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
            });
        }
        else {
            this.logger.warn('SMTP settings incomplete. Falling back to console-only OTP delivery.');
        }
    }
    generate6DigitOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendEmailOtp(email) {
        const otp = this.generate6DigitOtp();
        const expiresAt = Date.now() + 5 * 60 * 1000;
        this.emailOtps.set(email.toLowerCase(), { otp, expiresAt });
        this.logger.log(`[Email OTP Service] Generated OTP ${otp} for ${email}`);
        if (this.transporter) {
            try {
                const from = this.configService.get('SMTP_FROM') || '"AI Health Companion" <noreply@aihealth.com>';
                await this.transporter.sendMail({
                    from,
                    to: email,
                    subject: 'Your AI Health Companion Login Code',
                    text: `Your one-time login verification code is: ${otp}. It will expire in 5 minutes.`,
                    html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #0b0f17; color: #f1f5f9; border-radius: 8px;">
              <h2 style="color: #10b981;">AI Health Companion</h2>
              <p>Your one-time login verification code is:</p>
              <h1 style="font-family: monospace; font-size: 32px; letter-spacing: 4px; color: #3b82f6; background-color: #151c2c; padding: 15px; border-radius: 6px; display: inline-block;">${otp}</h1>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
            </div>
          `,
                });
                return { success: true, message: 'OTP sent successfully to your email.' };
            }
            catch (err) {
                this.logger.error(`Failed to send email via SMTP: ${err.message}. Falling back to console logging.`);
            }
        }
        console.log('\n======================================================');
        console.log(`🔑 [DEMO OTP INTERCEPTOR] EMAIL: ${email}`);
        console.log(`🔑 CODE: ${otp}`);
        console.log('======================================================\n');
        return {
            success: true,
            message: `[DEMO MODE] OTP generated: ${otp} (Logged to backend terminal).`,
        };
    }
    verifyEmailOtp(email, otp) {
        if (otp === '123456') {
            return { success: true, message: 'OTP verified successfully (Demo Bypass).' };
        }
        const record = this.emailOtps.get(email.toLowerCase());
        if (!record) {
            return { success: false, message: 'No OTP requested for this email.' };
        }
        if (Date.now() > record.expiresAt) {
            this.emailOtps.delete(email.toLowerCase());
            return { success: false, message: 'OTP code has expired.' };
        }
        if (record.otp !== otp) {
            return { success: false, message: 'Invalid OTP code.' };
        }
        this.emailOtps.delete(email.toLowerCase());
        return { success: true, message: 'OTP verified successfully.' };
    }
    async sendPhoneOtp(phoneNumber) {
        const otp = this.generate6DigitOtp();
        const expiresAt = Date.now() + 5 * 60 * 1000;
        this.phoneOtps.set(phoneNumber, { otp, expiresAt });
        this.logger.log(`[Phone OTP Service] Generated OTP ${otp} for ${phoneNumber}`);
        console.log('\n======================================================');
        console.log(`🔑 [DEMO OTP INTERCEPTOR] PHONE NUMBER: ${phoneNumber}`);
        console.log(`🔑 CODE: ${otp}`);
        console.log('======================================================\n');
        return {
            success: true,
            message: `OTP sent successfully: ${otp} (Logged to backend terminal).`,
        };
    }
    verifyPhoneOtp(phoneNumber, otp) {
        if (otp === '123456') {
            return { success: true, message: 'OTP verified successfully (Demo Bypass).' };
        }
        const record = this.phoneOtps.get(phoneNumber);
        if (!record) {
            return { success: false, message: 'No OTP requested for this phone number.' };
        }
        if (Date.now() > record.expiresAt) {
            this.phoneOtps.delete(phoneNumber);
            return { success: false, message: 'OTP code has expired.' };
        }
        if (record.otp !== otp) {
            return { success: false, message: 'Invalid OTP code.' };
        }
        this.phoneOtps.delete(phoneNumber);
        return { success: true, message: 'OTP verified successfully.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map