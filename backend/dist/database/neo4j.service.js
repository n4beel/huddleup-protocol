"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
let Neo4jService = class Neo4jService {
    configService;
    driver;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        const uri = this.configService.get('database.uri');
        const username = this.configService.get('database.username');
        const password = this.configService.get('database.password');
        const database = this.configService.get('database.database');
        if (!uri || !username || !password) {
            throw new Error('Neo4j URI, username and password are required');
        }
        this.driver = neo4j_driver_1.default.driver(uri, neo4j_driver_1.default.auth.basic(username, password));
        try {
            await this.driver.verifyConnectivity();
            console.log('✅ Connected to Neo4j Aura database');
        }
        catch (error) {
            console.error('❌ Failed to connect to Neo4j Aura:', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        await this.driver.close();
    }
    getSession(database) {
        const db = database || this.configService.get('database.database');
        return this.driver.session({ database: db });
    }
    async runQuery(query, parameters = {}, database) {
        const session = this.getSession(database);
        try {
            const result = await session.run(query, parameters);
            return result.records.map(record => record.toObject());
        }
        finally {
            await session.close();
        }
    }
    async runWriteQuery(query, parameters = {}, database) {
        const session = this.getSession(database);
        try {
            const result = await session.executeWrite(tx => tx.run(query, parameters));
            return result.records.map(record => record.toObject());
        }
        finally {
            await session.close();
        }
    }
};
exports.Neo4jService = Neo4jService;
exports.Neo4jService = Neo4jService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], Neo4jService);
//# sourceMappingURL=neo4j.service.js.map