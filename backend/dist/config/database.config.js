"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    uri: process.env.NEO4J_URI || 'neo4j+s://1bcad8f7.databases.neo4j.io',
    username: process.env.NEO4J_USERNAME || '',
    password: process.env.NEO4J_PASSWORD || '',
    database: process.env.NEO4J_DATABASE || 'neo4j',
    auraInstanceId: process.env.AURA_INSTANCEID || '',
    auraInstanceName: process.env.AURA_INSTANCENAME || '',
}));
//# sourceMappingURL=database.config.js.map