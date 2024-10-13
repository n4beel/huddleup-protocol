import { Injectable } from '@nestjs/common';
import { Neo4jService } from './database/neo4j.service';

@Injectable()
export class AppService {
  constructor(private readonly neo4jService: Neo4jService) { }

  getHello(): string {
    return 'Hello from HuddleUp Backend!';
  }

  async getHealth() {
    try {
      // Test Neo4j connection
      const result = await this.neo4jService.runQuery('RETURN 1 as test');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        version: '1.0.0',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
        version: '1.0.0',
      };
    }
  }
}
