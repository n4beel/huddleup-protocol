import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Session } from 'neo4j-driver';
export declare class Neo4jService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private driver;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getSession(database?: string): Session;
    runQuery(query: string, parameters?: Record<string, any>, database?: string): Promise<import("neo4j-driver").RecordShape[]>;
    runWriteQuery(query: string, parameters?: Record<string, any>, database?: string): Promise<import("neo4j-driver").RecordShape[]>;
    runWriteRelationQuery(query: string, parameters?: Record<string, any>, database?: string): Promise<import("neo4j-driver").RecordShape[]>;
}
