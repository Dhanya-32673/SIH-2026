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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const class_validator_1 = require("class-validator");
class SendEmailOtpDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendEmailOtpDto.prototype, "email", void 0);
class VerifyEmailOtpDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyEmailOtpDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], VerifyEmailOtpDto.prototype, "otp", void 0);
class SendPhoneOtpDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format. Must be E.164 standard.' }),
    __metadata("design:type", String)
], SendPhoneOtpDto.prototype, "phoneNumber", void 0);
class VerifyPhoneOtpDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format.' }),
    __metadata("design:type", String)
], VerifyPhoneOtpDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], VerifyPhoneOtpDto.prototype, "otp", void 0);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async sendEmailOtp(body) {
        return this.authService.sendEmailOtp(body.email);
    }
    async verifyEmailOtp(body) {
        const result = this.authService.verifyEmailOtp(body.email, body.otp);
        if (!result.success) {
            throw new common_1.BadRequestException(result.message);
        }
        return result;
    }
    async sendPhoneOtp(body) {
        return this.authService.sendPhoneOtp(body.phoneNumber);
    }
    async verifyPhoneOtp(body) {
        const result = this.authService.verifyPhoneOtp(body.phoneNumber, body.otp);
        if (!result.success) {
            throw new common_1.BadRequestException(result.message);
        }
        return result;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('send-email-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendEmailOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendEmailOtp", null);
__decorate([
    (0, common_1.Post)('verify-email-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyEmailOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmailOtp", null);
__decorate([
    (0, common_1.Post)('send-phone-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendPhoneOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendPhoneOtp", null);
__decorate([
    (0, common_1.Post)('verify-phone-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyPhoneOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyPhoneOtp", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map