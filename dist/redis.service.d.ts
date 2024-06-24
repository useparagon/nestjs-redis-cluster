import * as IORedis from 'ioredis';
import { RedisClient } from './redis.provider';
import { RedisModuleOptions } from './redis.interface';
export declare class RedisService {
    private readonly redisClient;
    private readonly options;
    constructor(redisClient: RedisClient, options: RedisModuleOptions | RedisModuleOptions[]);
    getClient(name?: string): IORedis.Redis;
    getClients(): Map<string, IORedis.Redis>;
    disconnectAllClients(): void;
}
