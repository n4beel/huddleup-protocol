"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = [
        'https://huddleup-protocol.vercel.app',
        'https://huddleup-protocol-admin.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
    ];
    if (process.env.CORS_ORIGIN) {
        const additionalOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
        allowedOrigins.push(...additionalOrigins);
    }
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 HuddleUp Backend running on port ${port}`);
    console.log(`🌐 CORS enabled for origins: ${allowedOrigins.join(', ')}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
//# sourceMappingURL=main.js.map