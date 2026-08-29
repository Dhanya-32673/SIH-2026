"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    const port = process.env.PORT || 4000;
    await app.listen(port);
    logger.log(`=======================================================`);
    logger.log(` AI-POWERED PERSONAL HEALTH COMPANION - NESTJS BACKEND `);
    logger.log(`=======================================================`);
    logger.log(` HTTP REST Server running on: http://localhost:${port}`);
    logger.log(` WebSocket Gateway running on: ws://localhost:${port}/health`);
    logger.log(` Active Health & Sensor Simulation Pipeline: 1 Hz TICK`);
    logger.log(`=======================================================`);
}
bootstrap();
//# sourceMappingURL=main.js.map