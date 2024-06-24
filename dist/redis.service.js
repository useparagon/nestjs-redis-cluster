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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const redis_constants_1 = require("./redis.constants");
const redis_provider_1 = require("./redis.provider");
let RedisService = class RedisService {
    constructor(redisClient, options) {
        this.redisClient = redisClient;
        this.options = options;
    }
    getClient(name) {
        if (!name) {
            name = this.redisClient.defaultKey;
        }
        if (!this.redisClient.clients.has(name)) {
            throw new redis_provider_1.RedisClientError(`client ${name} does not exist`);
        }
        return this.redisClient.clients.get(name);
    }
    getClients() {
        return this.redisClient.clients;
    }
    disconnectAllClients() {
        const closeConnection = ({ clients, defaultKey }) => (options) => {
            const name = options.name || defaultKey;
            const client = clients.get(name);
            if (client && !options.keepAlive) {
                client.disconnect();
            }
        };
        const closeClientConnection = closeConnection(this.redisClient);
        if (Array.isArray(this.options)) {
            this.options.forEach(closeClientConnection);
        }
        else {
            closeClientConnection(this.options);
        }
    }
};
RedisService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(redis_constants_1.REDIS_CLIENT)),
    __param(1, common_1.Inject(redis_constants_1.REDIS_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object, Object])
], RedisService);
exports.RedisService = RedisService;
