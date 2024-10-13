import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        database: string;
        version: string;
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        database: string;
        error: any;
        version: string;
    }>;
}
