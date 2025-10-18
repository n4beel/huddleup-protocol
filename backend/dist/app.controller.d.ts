import { AppService } from './app.service';
import { HealthResponseDto } from './dto/health-response.dto';
import { CorsTestResponseDto } from './dto/cors-test-response.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHealth(): Promise<HealthResponseDto>;
    getCorsTest(): CorsTestResponseDto;
}
