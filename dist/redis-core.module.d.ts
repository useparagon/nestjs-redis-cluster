import { DynamicModule, OnApplicationShutdown } from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import { RedisClient } from './redis.provider';
export declare class RedisCoreModule implements OnApplicationShutdown {
    private readonly options;
    private readonly redisClient;
    constructor(options: RedisModuleOptions | RedisModuleOptions[], redisClient: RedisClient);
    static register(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule;
    onApplicationShutdown(): void;
}
