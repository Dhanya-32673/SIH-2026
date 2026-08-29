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
exports.EnvironmentController = void 0;
const common_1 = require("@nestjs/common");
const environment_service_1 = require("./environment.service");
let EnvironmentController = class EnvironmentController {
    constructor(envService) {
        this.envService = envService;
    }
    getLatest() {
        return {
            success: true,
            data: this.envService.getLatest(),
        };
    }
    getHistory(limit) {
        const lim = limit ? parseInt(limit, 10) : 60;
        return {
            success: true,
            data: this.envService.getHistory(lim),
        };
    }
};
exports.EnvironmentController = EnvironmentController;
__decorate([
    (0, common_1.Get)('latest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EnvironmentController.prototype, "getLatest", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnvironmentController.prototype, "getHistory", null);
exports.EnvironmentController = EnvironmentController = __decorate([
    (0, common_1.Controller)('api/environment'),
    __metadata("design:paramtypes", [environment_service_1.EnvironmentService])
], EnvironmentController);
//# sourceMappingURL=environment.controller.js.map