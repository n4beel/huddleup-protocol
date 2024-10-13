import { Neo4jService } from './database/neo4j.service';
export declare class AppService {
    private readonly neo4jService;
    constructor(neo4jService: Neo4jService);
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
