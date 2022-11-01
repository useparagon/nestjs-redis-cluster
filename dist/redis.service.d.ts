import * as IORedis from 'ioredis';
import { RedisClient } from './redis.provider';
export declare class RedisService {
    private readonly redisClient;
    constructor(redisClient: RedisClient);
    getClient(name?: string): IORedis.Redis;
    getClients(): Map<string, IORedis.Redis>;
}
