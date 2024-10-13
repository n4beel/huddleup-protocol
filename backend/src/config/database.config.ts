import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    uri: process.env.NEO4J_URI || 'neo4j+s://1bcad8f7.databases.neo4j.io',
    username: process.env.NEO4J_USERNAME || '',
    password: process.env.NEO4J_PASSWORD || '',
    database: process.env.NEO4J_DATABASE || 'neo4j',
    auraInstanceId: process.env.AURA_INSTANCEID || '',
    auraInstanceName: process.env.AURA_INSTANCENAME || '',
}));
