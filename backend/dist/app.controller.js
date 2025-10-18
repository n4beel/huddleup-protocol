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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_service_1 = require("./app.service");
const health_response_dto_1 = require("./dto/health-response.dto");
const cors_test_response_dto_1 = require("./dto/cors-test-response.dto");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getHealth() {
        return this.appService.getHealth();
    }
    getCorsTest() {
        return {
            message: 'CORS is working correctly!',
            timestamp: new Date().toISOString(),
            allowedOrigins: [
                'https://huddleup-protocol.vercel.app',
                'https://huddleup-protocol-admin.vercel.app',
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:3002'
            ]
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get welcome message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns a welcome message' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiTags)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns health status including database connectivity',
        type: health_response_dto_1.HealthResponseDto
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('cors-test'),
    (0, swagger_1.ApiTags)('cors'),
    (0, swagger_1.ApiOperation)({ summary: 'Test CORS configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns CORS test information',
        type: cors_test_response_dto_1.CorsTestResponseDto
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", cors_test_response_dto_1.CorsTestResponseDto)
], AppController.prototype, "getCorsTest", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('general'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map