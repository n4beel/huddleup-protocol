import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
    private driver: Driver;

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        const uri = this.configService.get<string>('database.uri');
        const username = this.configService.get<string>('database.username');
        const password = this.configService.get<string>('database.password');
        const database = this.configService.get<string>('database.database');

        if (!uri || !username || !password) {
            throw new Error('Neo4j URI, username and password are required');
        }

        this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

        try {
            await this.driver.verifyConnectivity();
            console.log('✅ Connected to Neo4j Aura database');
        } catch (error) {
            console.error('❌ Failed to connect to Neo4j Aura:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.driver.close();
    }

    getSession(database?: string): Session {
        const db = database || this.configService.get<string>('database.database');
        return this.driver.session({ database: db });
    }

    async runQuery(query: string, parameters: Record<string, any> = {}, database?: string) {
        const session = this.getSession(database);
        try {
            const result = await session.run(query, parameters);
            return result.records.map(record => record.toObject());
        } finally {
            await session.close();
        }
    }

    async runWriteQuery(query: string, parameters: Record<string, any> = {}, database?: string) {
        const session = this.getSession(database);
        try {
            const result = await session.executeWrite(tx => tx.run(query, parameters));
            return result.records.map(record => record.toObject());
        } finally {
            await session.close();
        }
    }

    async runWriteRelationQuery(query: string, parameters: Record<string, any> = {}, database?: string) {
        const session = this.getSession(database);
        try {
            const result = await session.executeWrite(tx => tx.run(query, parameters));
            return result.records.map(record => record.toObject());
        } finally {
            await session.close();
        }
    }
}
