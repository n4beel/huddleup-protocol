import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Neo4jService } from './neo4j.service';
import databaseConfig from '../config/database.config';

@Module({
    imports: [ConfigModule.forFeature(databaseConfig)],
    providers: [Neo4jService],
    exports: [Neo4jService],
})
export class DatabaseModule { }
